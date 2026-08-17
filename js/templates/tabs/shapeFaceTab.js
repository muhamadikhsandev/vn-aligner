export const shapeFaceTabHTML = `
<!-- TAB: BENTUK WAJAH (FACE SHAPE TEMPLATE & DEFORMATION ENGINE) -->
<div x-show="activeTab === 'shapeFace'" class="flex flex-col gap-2">
  
  <!-- SECTION 1: CETAK BENTUK WAJAH (FACE SHAPE TEMPLATE) -->
  <div class="bg-pink-950/40 p-2.5 rounded-xl border border-pink-800/60 flex flex-col gap-2 shadow-lg">
    
    <!-- Title & Header Buttons -->
    <div class="flex items-center justify-between gap-1 flex-wrap">
      <span class="text-xs font-bold text-pink-300 flex items-center gap-1.5">
        <i data-lucide="sparkles" class="w-4 h-4 text-pink-400"></i> Cetak Bentuk Wajah
      </span>

      <div class="flex items-center gap-1">
        <button @click="toggleLockImagePosition()"
                class="px-2 py-0.5 rounded-full text-[9px] font-bold border transition-all cursor-pointer flex items-center gap-1"
                :class="lockImagePosition ? 'bg-amber-600 border-amber-400 text-white shadow' : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'"
                title="Kunci posisi gambar agar saat tarik-tarik titik tidak sengaja kegeser">
          <i x-show="lockImagePosition" data-lucide="lock" class="w-3 h-3 text-amber-300"></i>
          <i x-show="!lockImagePosition" data-lucide="unlock" class="w-3 h-3 text-slate-400"></i>
          <span x-text="lockImagePosition ? 'Posisi Terkunci' : 'Kunci Posisi'"></span>
        </button>

        <button @click="showBeforeAfter = !showBeforeAfter; renderPreview()" 
                class="px-2 py-0.5 rounded-full text-[9px] font-bold border transition-all cursor-pointer flex items-center gap-1"
                :class="showBeforeAfter ? 'bg-amber-600 border-amber-400 text-white shadow' : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'"
                title="Bandingkan Wajah Original Sebelum vs Sesudah Deformation">
          <i data-lucide="eye" class="w-3 h-3"></i> 
          <span x-text="showBeforeAfter ? 'Original (Before)' : 'Before/After'"></span>
        </button>

        <button @click="resetContourPoints()" 
                class="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-full text-[9px] font-bold cursor-pointer transition-all">
          Reset Shape
        </button>
      </div>
    </div>

    <p class="text-[10px] text-pink-200/70 leading-relaxed">
      Ambil kontur lubang wajah dari body sebagai <b>TEMPLATE</b>. Wajah terdeformasi mengikuti template tanpa merusak detail internal.
    </p>

    <!-- Preset Shape Templates -->
    <div class="flex flex-col gap-1 bg-slate-950/80 p-2 rounded-lg border border-pink-900/40">
      <span class="text-[10px] font-semibold text-slate-300 flex items-center gap-1">
        <i data-lucide="sparkles" class="w-3 h-3 text-pink-400"></i> Preset Bentuk Lubang Wajah:
      </span>
      <div class="grid grid-cols-2 gap-1">
        <button @click="applyContourPreset('hijabHole'); applyHijabPreset()" 
                class="px-2 py-1 bg-pink-900/60 hover:bg-pink-600 border border-pink-700/70 text-white rounded text-[9px] font-bold cursor-pointer transition-all flex items-center justify-center gap-1 shadow">
          <i data-lucide="sparkles" class="w-3 h-3 text-pink-300"></i> Pas Lubang Hijab
        </button>
        <button @click="applyContourPreset('vShape')" 
                class="px-2 py-1 bg-slate-900 hover:bg-pink-900/50 border border-slate-700 text-slate-200 rounded text-[9px] font-bold cursor-pointer transition-all flex items-center justify-center gap-1">
          <i data-lucide="scissors" class="w-3 h-3 text-pink-400"></i> Tirus V-Shape
        </button>
        <button @click="applyContourPreset('round')" 
                class="px-2 py-1 bg-slate-900 hover:bg-pink-900/50 border border-slate-700 text-slate-200 rounded text-[9px] font-bold cursor-pointer transition-all flex items-center justify-center gap-1">
          <i data-lucide="circle" class="w-3 h-3 text-pink-400"></i> Bulat / Chubby
        </button>
        <button @click="applyContourPreset('square')" 
                class="px-2 py-1 bg-slate-900 hover:bg-pink-900/50 border border-slate-700 text-slate-200 rounded text-[9px] font-bold cursor-pointer transition-all flex items-center justify-center gap-1">
          <i data-lucide="square" class="w-3 h-3 text-pink-400"></i> Kotak / Square
        </button>
      </div>
    </div>

    <!-- Interactive Canvas Contour Point Editor Tools -->
    <div class="bg-slate-950/90 p-2 rounded-lg border border-slate-800 flex flex-col gap-1">
      <div class="flex items-center justify-between text-[10px]">
        <span class="font-bold text-slate-300 flex items-center gap-1">
          <i data-lucide="move" class="w-3 h-3 text-pink-400"></i> Kontrol Titik Kontur Canvas:
        </span>
        <span class="font-mono text-pink-400 font-bold" 
              x-text="(currentFaceTransform.reshape?.templatePoints?.length || 0) + ' Titik'"></span>
      </div>

      <div class="flex items-center gap-1">
        <button @click="addContourPoint()" 
                class="flex-1 px-2 py-1 bg-slate-900 hover:bg-pink-900/40 text-pink-300 border border-pink-800/60 rounded text-[9px] font-bold cursor-pointer transition-all flex items-center justify-center gap-1">
          <i data-lucide="plus-circle" class="w-3 h-3 text-pink-400"></i> Tambah Titik
        </button>
        <button @click="removeContourPoint()" 
                class="flex-1 px-2 py-1 bg-slate-900 hover:bg-red-900/40 text-red-300 border border-red-800/60 rounded text-[9px] font-bold cursor-pointer transition-all flex items-center justify-center gap-1"
                :disabled="!currentFaceTransform.reshape?.templatePoints || currentFaceTransform.reshape.templatePoints.length <= 4">
          <i data-lucide="minus-circle" class="w-3 h-3 text-red-400"></i> Hapus Titik
        </button>
        <button @click="showTemplateOutline = !showTemplateOutline; renderPreview()" 
                class="px-2 py-1 rounded text-[9px] font-bold border transition-all cursor-pointer flex items-center gap-1"
                :class="showTemplateOutline ? 'bg-pink-900/70 border-pink-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400'">
          <i data-lucide="eye" class="w-3 h-3"></i> Outline
        </button>
      </div>

      <!-- Active Selected Contour Point Fine Tune -->
      <template x-if="currentFaceTransform.reshape?.templatePoints && currentFaceTransform.reshape.templatePoints[selectedContourPointIndex]">
        <div class="mt-1 bg-slate-900/80 p-1.5 rounded border border-slate-800/90 flex flex-col gap-1 text-[10px]">
          <div class="flex justify-between items-center text-pink-300 font-semibold">
            <span x-text="'Titik #' + (selectedContourPointIndex + 1) + ' (' + (currentFaceTransform.reshape.templatePoints[selectedContourPointIndex].label || 'Kontur') + ')'"></span>
            <span class="font-mono text-slate-400" 
                  x-text="'U:' + (currentFaceTransform.reshape.templatePoints[selectedContourPointIndex].u * 100).toFixed(0) + '% V:' + (currentFaceTransform.reshape.templatePoints[selectedContourPointIndex].v * 100).toFixed(0) + '%'"></span>
          </div>

          <!-- Fine Adjust Horisontal U -->
          <div class="flex items-center gap-1.5">
            <span class="w-7 text-slate-400 font-bold shrink-0">X (U):</span>
            <input type="range" min="-20" max="120" 
                   :value="Math.round(currentFaceTransform.reshape.templatePoints[selectedContourPointIndex].u * 100)"
                   @input="currentFaceTransform.reshape.templatePoints[selectedContourPointIndex].u = parseInt($event.target.value)/100; currentFaceTransform.reshape.useTemplate = true; renderPreview()"
                   @change="pushHistoryState()"
                   class="w-full accent-pink-500 bg-slate-800 h-1.5 rounded cursor-pointer">
          </div>

          <!-- Fine Adjust Vertikal V -->
          <div class="flex items-center gap-1.5">
            <span class="w-7 text-slate-400 font-bold shrink-0">Y (V):</span>
            <input type="range" min="-20" max="120" 
                   :value="Math.round(currentFaceTransform.reshape.templatePoints[selectedContourPointIndex].v * 100)"
                   @input="currentFaceTransform.reshape.templatePoints[selectedContourPointIndex].v = parseInt($event.target.value)/100; currentFaceTransform.reshape.useTemplate = true; renderPreview()"
                   @change="pushHistoryState()"
                   class="w-full accent-pink-500 bg-slate-800 h-1.5 rounded cursor-pointer">
          </div>
        </div>
      </template>
    </div>

    <!-- Template Library: Save & Load User Face Shapes -->
    <div class="bg-slate-950/80 p-2 rounded-lg border border-slate-800 flex flex-col gap-1">
      <span class="text-[10px] font-bold text-slate-300 flex items-center gap-1">
        <i data-lucide="bookmark" class="w-3 h-3 text-pink-400"></i> Simpan / Gunakan Template Terdaftar:
      </span>

      <div class="flex items-center gap-1">
        <input type="text" x-model="newTemplateName" placeholder="Nama Template (ex: Hijab Body A)..." 
               class="flex-1 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-pink-500">
        <button @click="saveCurrentTemplate()" 
                class="px-2.5 py-1 bg-pink-600 hover:bg-pink-500 text-white rounded text-[10px] font-bold cursor-pointer transition-all shadow shrink-0">
          Simpan
        </button>
      </div>

      <!-- Saved Templates Dropdown / Selector -->
      <template x-if="faceShapeTemplates.length > 0">
        <div class="flex flex-col gap-1 mt-1">
          <div class="flex items-center gap-1">
            <select x-model="selectedTemplateId" @change="loadTemplate($event.target.value)"
                    class="flex-1 bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded p-1 font-semibold focus:outline-none focus:border-pink-500">
              <option value="">-- Pilih Template Tersimpan --</option>
              <template x-for="tpl in faceShapeTemplates" :key="tpl.id">
                <option :value="tpl.id" x-text="tpl.name + ' (' + tpl.points.length + ' Titik)'"></option>
              </template>
            </select>

            <button @click="if (selectedTemplateId) deleteTemplate(selectedTemplateId)" 
                    class="p-1 bg-slate-900 hover:bg-red-900/60 text-red-400 border border-slate-700 rounded cursor-pointer"
                    title="Hapus Template Terpilih" :disabled="!selectedTemplateId">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>
      </template>
    </div>

    <!-- Quick Layer Order Switcher for Hijab Fit -->
    <div class="flex items-center justify-between bg-slate-950/80 p-2 rounded-lg border border-slate-800/80">
      <span class="text-[10px] font-semibold text-slate-300">Posisi Layer Wajah:</span>
      <div class="flex items-center gap-1">
        <button @click="setFaceLayerOrder('below')" 
                class="px-2 py-1 rounded text-[9px] font-bold border transition-all cursor-pointer"
                :class="currentFaceLayerOrder === 'below' ? 'bg-pink-600 border-pink-400 text-white shadow-md' : 'bg-slate-950 border-slate-800 text-slate-400'">
          DI BAWAH (Lubang Kerudung)
        </button>
        <button @click="setFaceLayerOrder('above')" 
                class="px-2 py-1 rounded text-[9px] font-bold border transition-all cursor-pointer"
                :class="currentFaceLayerOrder === 'above' ? 'bg-pink-600 border-pink-400 text-white shadow-md' : 'bg-slate-950 border-slate-800 text-slate-400'">
          DI ATAS
        </button>
      </div>
    </div>

  </div>

  <!-- SECTION 2: FINE TUNING PARAMETRIC SLIDERS (ALIS, MATA, HIDUNG, MULUT, RAHANG) -->
  <div class="bg-slate-950/60 p-2 rounded-xl border border-slate-800 flex flex-col gap-2">
    <div class="flex items-center justify-between">
      <span class="text-xs font-bold text-slate-300 flex items-center gap-1.5">
        <i data-lucide="sliders" class="w-3.5 h-3.5 text-blue-400"></i> Adjust Fitur Wajah Detail
      </span>
      <button @click="resetFaceReshape()" class="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800 rounded text-[9px] font-bold cursor-pointer">
        Reset Slider
      </button>
    </div>

    <!-- SUB-SECTION: MATA (EYES) -->
    <div class="bg-slate-900/80 p-2 rounded-lg border border-slate-800 flex flex-col gap-1.5">
      <span class="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
        <i data-lucide="eye" class="w-3 h-3 text-emerald-400"></i> Pengaturan Mata:
      </span>
      
      <div class="grid grid-cols-2 gap-1.5">
        <!-- Ukuran Mata -->
        <div class="bg-slate-950/80 p-1.5 rounded border border-slate-800 flex flex-col gap-0.5">
          <div class="flex justify-between items-center text-[9px]">
            <span class="text-slate-300">Ukuran:</span>
            <span class="font-mono text-emerald-400 font-bold" x-text="(currentFaceTransform.reshape?.eyeScale || 100) + '%'"></span>
          </div>
          <input type="range" min="10" max="400" :value="currentFaceTransform.reshape?.eyeScale || 100" @input="updateFaceReshape('eyeScale', $event.target.value)" @change="pushHistoryState()" class="w-full accent-emerald-500 bg-slate-800 h-1.5 rounded cursor-pointer">
        </div>

        <!-- Jarak Antar Mata -->
        <div class="bg-slate-950/80 p-1.5 rounded border border-slate-800 flex flex-col gap-0.5">
          <div class="flex justify-between items-center text-[9px]">
            <span class="text-slate-300">Jarak Mata:</span>
            <span class="font-mono text-emerald-400 font-bold" x-text="currentFaceTransform.reshape?.eyeDistance || 0"></span>
          </div>
          <input type="range" min="-100" max="100" :value="currentFaceTransform.reshape?.eyeDistance || 0" @input="updateFaceReshape('eyeDistance', $event.target.value)" @change="pushHistoryState()" class="w-full accent-emerald-500 bg-slate-800 h-1.5 rounded cursor-pointer">
        </div>
      </div>

      <!-- Posisi Y Mata -->
      <div class="bg-slate-950/80 p-1.5 rounded border border-slate-800 flex flex-col gap-0.5">
        <div class="flex justify-between items-center text-[9px]">
          <span class="text-slate-300">Tinggi Posisi Mata (Y):</span>
          <span class="font-mono text-emerald-400 font-bold" x-text="currentFaceTransform.reshape?.eyeY || 0"></span>
        </div>
        <input type="range" min="-100" max="100" :value="currentFaceTransform.reshape?.eyeY || 0" @input="updateFaceReshape('eyeY', $event.target.value)" @change="pushHistoryState()" class="w-full accent-emerald-500 bg-slate-800 h-1.5 rounded cursor-pointer">
      </div>
    </div>

    <!-- SUB-SECTION: ALIS (EYEBROWS) -->
    <div class="bg-slate-900/80 p-2 rounded-lg border border-slate-800 flex flex-col gap-1.5">
      <span class="text-[10px] font-bold text-amber-400 flex items-center gap-1">
        <i data-lucide="minus" class="w-3 h-3 text-amber-400"></i> Pengaturan Alis:
      </span>
      
      <div class="grid grid-cols-2 gap-1.5">
        <!-- Tinggi Alis Y -->
        <div class="bg-slate-950/80 p-1.5 rounded border border-slate-800 flex flex-col gap-0.5">
          <div class="flex justify-between items-center text-[9px]">
            <span class="text-slate-300">Tinggi Alis (Y):</span>
            <span class="font-mono text-amber-400 font-bold" x-text="currentFaceTransform.reshape?.eyebrowY || 0"></span>
          </div>
          <input type="range" min="-100" max="100" :value="currentFaceTransform.reshape?.eyebrowY || 0" @input="updateFaceReshape('eyebrowY', $event.target.value)" @change="pushHistoryState()" class="w-full accent-amber-500 bg-slate-800 h-1.5 rounded cursor-pointer">
        </div>

        <!-- Kemiringan Alis -->
        <div class="bg-slate-950/80 p-1.5 rounded border border-slate-800 flex flex-col gap-0.5">
          <div class="flex justify-between items-center text-[9px]">
            <span class="text-slate-300">Sudut / Miring:</span>
            <span class="font-mono text-amber-400 font-bold" x-text="currentFaceTransform.reshape?.eyebrowAngle || 0"></span>
          </div>
          <input type="range" min="-100" max="100" :value="currentFaceTransform.reshape?.eyebrowAngle || 0" @input="updateFaceReshape('eyebrowAngle', $event.target.value)" @change="pushHistoryState()" class="w-full accent-amber-500 bg-slate-800 h-1.5 rounded cursor-pointer">
        </div>
      </div>
    </div>

    <!-- SUB-SECTION: HIDUNG (NOSE) -->
    <div class="bg-slate-900/80 p-2 rounded-lg border border-slate-800 flex flex-col gap-1.5">
      <span class="text-[10px] font-bold text-cyan-400 flex items-center gap-1">
        <i data-lucide="triangle" class="w-3 h-3 text-cyan-400"></i> Pengaturan Hidung:
      </span>
      
      <div class="grid grid-cols-2 gap-1.5">
        <!-- Lebar Hidung -->
        <div class="bg-slate-950/80 p-1.5 rounded border border-slate-800 flex flex-col gap-0.5">
          <div class="flex justify-between items-center text-[9px]">
            <span class="text-slate-300">Lebar Hidung:</span>
            <span class="font-mono text-cyan-400 font-bold" x-text="(currentFaceTransform.reshape?.noseWidth || 100) + '%'"></span>
          </div>
          <input type="range" min="10" max="400" :value="currentFaceTransform.reshape?.noseWidth || 100" @input="updateFaceReshape('noseWidth', $event.target.value)" @change="pushHistoryState()" class="w-full accent-cyan-500 bg-slate-800 h-1.5 rounded cursor-pointer">
        </div>

        <!-- Posisi Y Hidung -->
        <div class="bg-slate-950/80 p-1.5 rounded border border-slate-800 flex flex-col gap-0.5">
          <div class="flex justify-between items-center text-[9px]">
            <span class="text-slate-300">Tinggi Hidung (Y):</span>
            <span class="font-mono text-cyan-400 font-bold" x-text="currentFaceTransform.reshape?.noseY || 0"></span>
          </div>
          <input type="range" min="-100" max="100" :value="currentFaceTransform.reshape?.noseY || 0" @input="updateFaceReshape('noseY', $event.target.value)" @change="pushHistoryState()" class="w-full accent-cyan-500 bg-slate-800 h-1.5 rounded cursor-pointer">
        </div>
      </div>
    </div>

    <!-- SUB-SECTION: MULUT (MOUTH) -->
    <div class="bg-slate-900/80 p-2 rounded-lg border border-slate-800 flex flex-col gap-1.5">
      <span class="text-[10px] font-bold text-pink-400 flex items-center gap-1">
        <i data-lucide="smile" class="w-3 h-3 text-pink-400"></i> Pengaturan Mulut:
      </span>
      
      <div class="grid grid-cols-3 gap-1">
        <!-- Lebar Mulut -->
        <div class="bg-slate-950/80 p-1.5 rounded border border-slate-800 flex flex-col gap-0.5">
          <div class="flex justify-between items-center text-[8px]">
            <span class="text-slate-300 truncate">Lebar:</span>
            <span class="font-mono text-pink-400 font-bold" x-text="(currentFaceTransform.reshape?.mouthWidth || 100) + '%'"></span>
          </div>
          <input type="range" min="10" max="400" :value="currentFaceTransform.reshape?.mouthWidth || 100" @input="updateFaceReshape('mouthWidth', $event.target.value)" @change="pushHistoryState()" class="w-full accent-pink-500 bg-slate-800 h-1.5 rounded cursor-pointer">
        </div>

        <!-- Skala Mulut -->
        <div class="bg-slate-950/80 p-1.5 rounded border border-slate-800 flex flex-col gap-0.5">
          <div class="flex justify-between items-center text-[8px]">
            <span class="text-slate-300 truncate">Ukuran:</span>
            <span class="font-mono text-pink-400 font-bold" x-text="(currentFaceTransform.reshape?.mouthScale || 100) + '%'"></span>
          </div>
          <input type="range" min="10" max="400" :value="currentFaceTransform.reshape?.mouthScale || 100" @input="updateFaceReshape('mouthScale', $event.target.value)" @change="pushHistoryState()" class="w-full accent-pink-500 bg-slate-800 h-1.5 rounded cursor-pointer">
        </div>

        <!-- Tinggi Mulut Y -->
        <div class="bg-slate-950/80 p-1.5 rounded border border-slate-800 flex flex-col gap-0.5">
          <div class="flex justify-between items-center text-[8px]">
            <span class="text-slate-300 truncate">Pos Y:</span>
            <span class="font-mono text-pink-400 font-bold" x-text="currentFaceTransform.reshape?.mouthY || 0"></span>
          </div>
          <input type="range" min="-100" max="100" :value="currentFaceTransform.reshape?.mouthY || 0" @input="updateFaceReshape('mouthY', $event.target.value)" @change="pushHistoryState()" class="w-full accent-pink-500 bg-slate-800 h-1.5 rounded cursor-pointer">
        </div>
      </div>
    </div>

    <!-- SUB-SECTION: BENTUK WAJAH & RAHANG -->
    <div class="bg-slate-900/80 p-2 rounded-lg border border-slate-800 flex flex-col gap-1.5">
      <span class="text-[10px] font-bold text-purple-300 flex items-center gap-1">
        <i data-lucide="user" class="w-3 h-3 text-purple-400"></i> Kontur Rahang, Pipi & Dahi:
      </span>

      <!-- Slider 1: Rahang / V-Shape -->
      <div class="bg-slate-950/70 p-1.5 rounded-lg border border-slate-800 flex flex-col gap-1">
        <div class="flex justify-between items-center text-xs"><span class="text-slate-300 font-medium">Rahang (V-Shape):</span><span class="font-mono text-purple-300 font-bold" x-text="currentFaceTransform.reshape?.vShape || 0"></span></div>
        <input type="range" min="-300" max="300" :value="currentFaceTransform.reshape?.vShape || 0" @input="updateFaceReshape('vShape', $event.target.value)" @change="pushHistoryState()" class="w-full accent-purple-500 bg-slate-800 h-1.5 rounded cursor-pointer">
      </div>

      <!-- Slider 2: Pipi -->
      <div class="bg-slate-950/70 p-1.5 rounded-lg border border-slate-800 flex flex-col gap-1">
        <div class="flex justify-between items-center text-xs"><span class="text-slate-300 font-medium">Pipi:</span><span class="font-mono text-purple-300 font-bold" x-text="currentFaceTransform.reshape?.cheekbones || 0"></span></div>
        <input type="range" min="-300" max="300" :value="currentFaceTransform.reshape?.cheekbones || 0" @input="updateFaceReshape('cheekbones', $event.target.value)" @change="pushHistoryState()" class="w-full accent-purple-500 bg-slate-800 h-1.5 rounded cursor-pointer">
      </div>

      <!-- Slider 3: Dahi -->
      <div class="bg-slate-950/70 p-1.5 rounded-lg border border-slate-800 flex flex-col gap-1">
        <div class="flex justify-between items-center text-xs"><span class="text-slate-300 font-medium">Dahi:</span><span class="font-mono text-purple-300 font-bold" x-text="currentFaceTransform.reshape?.forehead || 0"></span></div>
        <input type="range" min="-300" max="300" :value="currentFaceTransform.reshape?.forehead || 0" @input="updateFaceReshape('forehead', $event.target.value)" @change="pushHistoryState()" class="w-full accent-purple-500 bg-slate-800 h-1.5 rounded cursor-pointer">
      </div>

      <!-- Slider 4: Panjang Dagu -->
      <div class="bg-slate-950/70 p-1.5 rounded-lg border border-slate-800 flex flex-col gap-1">
        <div class="flex justify-between items-center text-xs"><span class="text-slate-300 font-medium">Panjang Dagu:</span><span class="font-mono text-purple-300 font-bold" x-text="currentFaceTransform.reshape?.chinLength || 0"></span></div>
        <input type="range" min="-300" max="300" :value="currentFaceTransform.reshape?.chinLength || 0" @input="updateFaceReshape('chinLength', $event.target.value)" @change="pushHistoryState()" class="w-full accent-purple-500 bg-slate-800 h-1.5 rounded cursor-pointer">
      </div>
    </div>

  </div>

</div>
`;
