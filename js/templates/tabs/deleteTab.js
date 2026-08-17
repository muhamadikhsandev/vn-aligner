export const deleteTabHTML = `
<!-- TAB: HAPUS & RESET -->
<div x-show="activeTab === 'delete'" class="flex flex-col gap-2">
  <div class="bg-rose-950/40 p-2.5 rounded-xl border border-rose-800/60 flex flex-col gap-2 shadow-lg">
    
    <div class="flex items-center justify-between">
      <span class="text-xs font-bold text-rose-300 flex items-center gap-1.5">
        <i data-lucide="trash-2" class="w-4 h-4 text-rose-400"></i> Hapus &amp; Reset Aset
      </span>
    </div>

    <!-- BRUSH HAPUS AREA TOOL -->
    <div class="bg-slate-950/90 p-2 rounded-lg border border-rose-900/60 flex flex-col gap-2 shadow-inner">
      <div class="flex items-center justify-between">
        <span class="text-[10px] font-bold text-rose-300 flex items-center gap-1.5">
          <i data-lucide="eraser" class="w-3.5 h-3.5 text-rose-400"></i> Tool Brush Hapus Manual:
        </span>
        <button @click="toggleEraserBrush()" 
                class="px-2.5 py-1 rounded text-[10px] font-bold border transition-all cursor-pointer flex items-center gap-1 shadow"
                :class="isEraserActive ? 'bg-rose-600 border-rose-400 text-white animate-pulse' : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'">
          <i data-lucide="eraser" class="w-3.5 h-3.5"></i>
          <span x-text="isEraserActive ? 'Brush ON (Mengapus)' : 'Aktifkan Brush'"></span>
        </button>
      </div>

      <!-- Target Selection for Brush -->
      <div class="flex items-center justify-between bg-slate-900 p-1.5 rounded border border-slate-800 text-[10px]">
        <span class="text-slate-400 font-medium">Target Layer Dihapus:</span>
        <div class="flex items-center gap-1">
          <button @click="activeTarget = 'face'" class="px-2 py-0.5 rounded text-[9px] font-bold border transition-all cursor-pointer" :class="activeTarget === 'face' ? 'bg-rose-600 border-rose-400 text-white shadow' : 'bg-slate-950 border-slate-800 text-slate-400'">Wajah</button>
          <button @click="activeTarget = 'body'" class="px-2 py-0.5 rounded text-[9px] font-bold border transition-all cursor-pointer" :class="activeTarget === 'body' ? 'bg-rose-600 border-rose-400 text-white shadow' : 'bg-slate-950 border-slate-800 text-slate-400'">Badan</button>
        </div>
      </div>

      <!-- Brush Size Slider -->
      <div class="flex flex-col gap-1 bg-slate-900 p-1.5 rounded border border-slate-800">
        <div class="flex justify-between items-center text-[10px]">
          <span class="text-slate-300 font-semibold flex items-center gap-1">
            <i data-lucide="circle" class="w-3 h-3 text-rose-400"></i> Ukuran Brush:
          </span>
          <span class="font-mono text-rose-400 font-bold" x-text="brushSize + 'px'"></span>
        </div>
        <input type="range" min="5" max="150" :value="brushSize" @input="brushSize = parseInt($event.target.value); renderPreview()" class="w-full accent-rose-500 bg-slate-800 h-1.5 rounded cursor-pointer">
      </div>

      <!-- Brush Opacity Slider -->
      <div class="flex flex-col gap-1 bg-slate-900 p-1.5 rounded border border-slate-800">
        <div class="flex justify-between items-center text-[10px]">
          <span class="text-slate-300 font-semibold flex items-center gap-1">
            <i data-lucide="droplet" class="w-3 h-3 text-rose-400"></i> Kepekatan Hapus:
          </span>
          <span class="font-mono text-rose-400 font-bold" x-text="brushOpacity + '%'"></span>
        </div>
        <input type="range" min="10" max="100" :value="brushOpacity" @input="brushOpacity = parseInt($event.target.value)" class="w-full accent-rose-500 bg-slate-800 h-1.5 rounded cursor-pointer">
      </div>

      <!-- Clear Eraser Strokes Button -->
      <button @click="clearEraseStrokes()" class="w-full px-2 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded text-[10px] font-bold cursor-pointer transition-all flex items-center justify-center gap-1.5">
        <i data-lucide="rotate-ccw" class="w-3.5 h-3.5 text-rose-400"></i> Kembalikan Area Terhapus (Reset Brush)
      </button>
    </div>

    <!-- Active Item Deletion -->
    <div class="bg-slate-950/80 p-2 rounded-lg border border-slate-800 flex flex-col gap-1.5">
      <span class="text-[10px] font-bold text-rose-300 flex items-center gap-1">
        <i data-lucide="trash" class="w-3 h-3 text-rose-400"></i> Hapus Item Terpilih Saat Ini:
      </span>
      <div class="grid grid-cols-2 gap-1.5">
        <button @click="deleteActiveFaceAsset()" :disabled="faceAssetList.length === 0" class="px-2 py-2 bg-rose-900/60 hover:bg-rose-600 text-white border border-rose-700 rounded-lg text-[10px] font-bold cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-1 shadow">
          <i data-lucide="smile" class="w-3.5 h-3.5 text-rose-300"></i> Hapus Wajah Aktif
        </button>
        <button @click="deleteActiveBodyAsset()" :disabled="bodyAssetList.length === 0" class="px-2 py-2 bg-rose-900/60 hover:bg-rose-600 text-white border border-rose-700 rounded-lg text-[10px] font-bold cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-1 shadow">
          <i data-lucide="user" class="w-3.5 h-3.5 text-rose-300"></i> Hapus Badan Aktif
        </button>
      </div>
    </div>

    <!-- Batch / Clear All -->
    <div class="bg-slate-950/80 p-2 rounded-lg border border-slate-800 flex flex-col gap-1.5">
      <span class="text-[10px] font-bold text-amber-300 flex items-center gap-1">
        <i data-lucide="alert-triangle" class="w-3 h-3 text-amber-400"></i> Hapus Masal &amp; Reset:
      </span>
      <div class="flex flex-col gap-1">
        <button @click="clearAllFaceAssets()" :disabled="faceAssetList.length === 0" class="w-full px-2.5 py-1.5 bg-slate-900 hover:bg-rose-950 text-rose-300 border border-rose-800/80 rounded-lg text-[10px] font-bold cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-between">
          <span>Hapus Semua Daftar Wajah</span>
          <span class="font-mono text-[9px] text-slate-400" x-text="faceAssetList.length + ' Item'"></span>
        </button>
        <button @click="clearAllBodyAssets()" :disabled="bodyAssetList.length === 0" class="w-full px-2.5 py-1.5 bg-slate-900 hover:bg-rose-950 text-rose-300 border border-rose-800/80 rounded-lg text-[10px] font-bold cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-between">
          <span>Hapus Semua Daftar Badan</span>
          <span class="font-mono text-[9px] text-slate-400" x-text="bodyAssetList.length + ' Item'"></span>
        </button>
        <button @click="resetContourPoints()" class="w-full px-2.5 py-1.5 bg-slate-900 hover:bg-amber-950 text-amber-300 border border-amber-800/80 rounded-lg text-[10px] font-bold cursor-pointer transition-all flex items-center justify-between">
          <span>Reset Template Shape Wajah</span>
          <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i>
        </button>
        <button @click="fullResetAll()" class="w-full px-2 py-2 bg-red-950/80 hover:bg-red-700 text-white border border-red-600 rounded-lg text-[10px] font-bold cursor-pointer transition-all flex items-center justify-center gap-1.5 mt-1 shadow-md">
          <i data-lucide="power" class="w-3.5 h-3.5"></i> RESET TOTAL SEMUA PROYEK
        </button>
      </div>
    </div>

  </div>
</div>
`;
