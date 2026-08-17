// js/templates/preview.js
// Preview canvas component HTML template (Full height & width focused canvas preview)

export const previewHTML = `
<div class="lg:col-span-8 flex-1 flex flex-col relative overflow-hidden h-full w-full min-h-0">

  <!-- CANVAS VIEWPORT CONTAINER (FULL CHECKERBOARD CANVAS AREA - NO EXTRA OUTER WRAPPER PADDING) -->
  <div class="relative flex-1 w-full h-full flex flex-col overflow-hidden border border-slate-800 rounded-xl checkerboard-bg min-h-0 shadow-2xl">
    
    <!-- TOP TOOLBAR — PILL TAB GROUP STYLE -->
    <div class="w-full flex items-center justify-between px-2 py-1.5 shrink-0 gap-2 z-20 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/60">

      <!-- LEFT: ALL TOGGLE TABS IN ONE BIG PILL CONTAINER -->
      <div class="flex-1 min-w-0 overflow-x-auto no-scrollbar touch-pan-x">
        <div class="flex items-center gap-1 bg-slate-900/80 border border-slate-700/60 rounded-2xl p-1 w-fit min-w-full sm:min-w-0 shadow-inner">

          <!-- Live Badge (non-interactive, stays inside pill) -->
          <span class="text-[10px] text-blue-400 font-bold px-2.5 py-1.5 flex items-center gap-1 shrink-0 whitespace-nowrap opacity-80">
            <i data-lucide="sparkles" class="w-3 h-3"></i>
          </span>

          <!-- Divider -->
          <div class="w-px h-5 bg-slate-700/60 mx-0.5 shrink-0"></div>

          <!-- 1. Mode Drag (Khusus Drag/Geser Posisi Aset Gambar) -->
          <button @click="setModeDrag()"
                  class="text-[10px] px-3 py-1.5 font-bold flex items-center gap-1.5 shrink-0 whitespace-nowrap rounded-xl transition-all cursor-pointer"
                  :class="canvasInteractionMode === 'drag' && isDragEnabled && !lockImagePosition
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30 ring-1 ring-emerald-400'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'"
                  title="Mode Khusus Drag: Geser posisi aset gambar saja tanpa mengubah ukuran">
            <i data-lucide="hand" class="w-3.5 h-3.5"></i> Mode Drag
          </button>

          <!-- 2. Mode Transform (Khusus Skala & Resize Box Handles) -->
          <button @click="setModeTransform()"
                  class="text-[10px] px-3 py-1.5 font-bold flex items-center gap-1.5 shrink-0 whitespace-nowrap rounded-xl transition-all cursor-pointer"
                  :class="canvasInteractionMode === 'transform' || activeTab === 'box'
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-500/30 ring-1 ring-cyan-400'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'"
                  title="Mode Khusus Transform: Skala, perlebar & resize dengan 8 titik sudut box">
            <i data-lucide="box" class="w-3.5 h-3.5"></i> Mode Transform
          </button>

          <!-- 3. Mode Bentuk (Khusus Deformasi Bentuk Wajah) -->
          <button @click="setModeShape()"
                  class="text-[10px] px-3 py-1.5 font-bold flex items-center gap-1.5 shrink-0 whitespace-nowrap rounded-xl transition-all cursor-pointer"
                  :class="canvasInteractionMode === 'shape' || activeTab === 'shapeFace'
                    ? 'bg-pink-600 text-white shadow-md shadow-pink-500/30 ring-1 ring-pink-400'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'"
                  title="Mode Khusus Bentuk Wajah: Tarik deformasi bentuk wajah secara bebas di canvas">
            <i data-lucide="sparkles" class="w-3.5 h-3.5"></i> Mode Bentuk
          </button>

          <!-- Divider -->
          <div class="w-px h-5 bg-slate-700/60 mx-0.5 shrink-0"></div>

          <!-- Garis Presisi Toggle -->
          <button @click="showGuidelines = !showGuidelines; renderPreview()"
                  class="text-[10px] px-2.5 py-1.5 font-bold flex items-center gap-1.5 shrink-0 whitespace-nowrap rounded-xl transition-all cursor-pointer"
                  :class="showGuidelines
                    ? 'bg-cyan-500/20 text-cyan-300 shadow-sm shadow-cyan-500/20'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'">
            <i data-lucide="crosshair" class="w-3 h-3"></i> Presisi
          </button>

          <!-- Kunci Posisi Toggle -->
          <button @click="toggleLockImagePosition()"
                  class="text-[10px] px-2.5 py-1.5 font-bold flex items-center gap-1.5 shrink-0 whitespace-nowrap rounded-xl transition-all cursor-pointer"
                  :class="lockImagePosition
                    ? 'bg-amber-500/20 text-amber-300 shadow-sm shadow-amber-500/20'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'">
            <i x-show="lockImagePosition" data-lucide="lock" class="w-3 h-3"></i>
            <i x-show="!lockImagePosition" data-lucide="unlock" class="w-3 h-3"></i>
            <span x-text="lockImagePosition ? 'Terkunci' : 'Kunci'"></span>
          </button>

          <!-- Brush Hapus Toggle -->
          <button @click="toggleEraserBrush()"
                  class="text-[10px] px-2.5 py-1.5 font-bold flex items-center gap-1.5 shrink-0 whitespace-nowrap rounded-xl transition-all cursor-pointer"
                  :class="isEraserActive
                    ? 'bg-rose-500/25 text-rose-300 shadow-sm shadow-rose-500/20 animate-pulse'
                    : 'text-slate-500 hover:text-rose-300 hover:bg-slate-800/60'">
            <i data-lucide="eraser" class="w-3 h-3"></i>
            <span x-text="isEraserActive ? 'Brush ON' : 'Hapus'"></span>
          </button>

          <!-- Sembunyikan Overlay Toggle -->
          <button @click="hideAllOverlays = !hideAllOverlays; renderPreview()"
                  class="text-[10px] px-2.5 py-1.5 font-bold flex items-center gap-1.5 shrink-0 whitespace-nowrap rounded-xl transition-all cursor-pointer"
                  :class="hideAllOverlays
                    ? 'bg-amber-500/20 text-amber-300 shadow-sm shadow-amber-500/20'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'">
            <i x-show="hideAllOverlays" data-lucide="eye-off" class="w-3 h-3"></i>
            <i x-show="!hideAllOverlays" data-lucide="eye" class="w-3 h-3"></i>
            <span x-text="hideAllOverlays ? 'Bersih' : 'Tampil'"></span>
          </button>

          <!-- Drag Status Indicator (non-interactive) -->
          <span x-show="isDragging" class="text-[10px] text-blue-400 font-bold px-2.5 py-1.5 flex items-center gap-1 shrink-0 whitespace-nowrap ml-1 rounded-xl bg-blue-500/10">
            <i data-lucide="pen-tool" class="w-3 h-3"></i>
            <span x-text="dragMode.startsWith('resize_') ? 'Skala' : 'Geser'"></span>
          </span>

        </div>
      </div>

      <!-- RIGHT: ZOOM DROPDOWN (PINNED) -->
      <div class="relative shrink-0 z-30" @click.outside="isZoomDropdownOpen = false">
        <button @click="isZoomDropdownOpen = !isZoomDropdownOpen" type="button"
                class="bg-slate-900/80 border border-slate-700/60 text-slate-300 text-[10px] font-bold rounded-2xl px-3 py-1.5 flex items-center gap-1.5 cursor-pointer hover:bg-slate-700/60 transition-all shadow-sm">
          <i data-lucide="zoom-in" class="w-3 h-3 text-slate-400"></i>
          <span x-text="camZoomPercent + '%'"></span>
          <i data-lucide="chevron-down" class="w-3 h-3 text-slate-500"></i>
        </button>
        <div x-show="isZoomDropdownOpen" class="absolute right-0 mt-1 w-28 bg-slate-900 border border-slate-700/60 rounded-2xl shadow-2xl z-50 py-1.5 overflow-hidden">
          <template x-for="item in zoomPresets" :key="item.value">
            <div @click="setCameraPreset(item.value); isZoomDropdownOpen = false"
                 class="px-3 py-1.5 text-[10px] font-bold cursor-pointer flex items-center justify-between hover:bg-slate-700/60 transition-all"
                 :class="camZoom === item.value ? 'bg-slate-700/60 text-slate-200' : 'text-slate-400'">
              <span x-text="item.label"></span>
              <i x-show="camZoom === item.value" data-lucide="check" class="w-3 h-3 text-slate-300"></i>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- CANVAS VIEWPORT AREA (100% FULL CHECKERBOARD AREA) -->
    <div class="flex-1 flex w-full h-full min-h-0 relative overflow-hidden">
      <!-- Canvas Area -->
      <div class="flex-1 relative flex items-center justify-center overflow-hidden">
        <div x-show="bodyAssetList.length === 0 && faceAssetList.length === 0 && bgType === 'transparent'" class="absolute inset-0 flex flex-col items-center justify-center text-center p-2 z-10 pointer-events-none">
          <i data-lucide="layers" class="w-8 h-8 text-slate-400 mb-2 opacity-60"></i>
          <p class="text-slate-300 text-xs font-medium max-w-[200px] bg-slate-950/90 px-3 py-1.5 rounded-lg border border-slate-800 backdrop-blur">Upload foto badan &amp; aset wajah atau atasi BG canvas</p>
        </div>
        <div class="preview-camera-container flex items-center justify-center m-auto shrink-0 relative h-full w-full"
             :style="'transform: scale(' + camZoom + ') translate(' + camPanX + 'px, ' + camPanY + 'px);'">
          <canvas id="previewCanvas"
                  @mousedown="handlePointerDown($event)"
                  @touchstart="handlePointerDown($event)"
                  :class="canvasInteractionMode === 'drag' ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : (canvasInteractionMode === 'shape' ? 'cursor-pen-edit' : 'cursor-move')"
                  class="max-w-full max-h-full object-contain touch-none"></canvas>
        </div>
      </div>

      <!-- Vertical Scrollbar Controls -->
      <div class="w-7 shrink-0 flex flex-col items-center bg-slate-950/90 border-l border-slate-800/60 p-0.5 gap-1 z-20">
        <button @click="panCamera(0, -30)" class="p-1 bg-slate-900 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded-lg cursor-pointer transition-all">
          <i data-lucide="chevron-up" class="w-3.5 h-3.5"></i>
        </button>
        <div class="flex-1 w-full flex items-center justify-center py-1 overflow-hidden">
          <input type="range" min="-800" max="800" :value="camPanY" @input="camPanY = parseInt($event.target.value)"
                 class="h-full accent-slate-400 bg-slate-800/60 rounded cursor-pointer range-vertical">
        </div>
        <button @click="panCamera(0, 30)" class="p-1 bg-slate-900 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded-lg cursor-pointer transition-all">
          <i data-lucide="chevron-down" class="w-3.5 h-3.5"></i>
        </button>
      </div>
    </div>

    <!-- Horizontal Scrollbar Controls -->
    <div class="h-7 shrink-0 w-full flex items-center bg-slate-950/80 border-t border-slate-800/60 px-1.5 gap-1.5 z-20">
      <button @click="panCamera(-30, 0)" class="p-1 bg-slate-900 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded-lg cursor-pointer transition-all">
        <i data-lucide="chevron-left" class="w-3.5 h-3.5"></i>
      </button>
      <input type="range" min="-800" max="800" :value="camPanX" @input="camPanX = parseInt($event.target.value)"
             class="flex-1 accent-slate-400 bg-slate-800/60 h-1.5 rounded-full cursor-pointer">
      <button @click="panCamera(30, 0)" class="p-1 bg-slate-900 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded-lg cursor-pointer transition-all">
        <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
      </button>
      <button @click="resetCameraPan()" class="p-1 bg-slate-800 hover:bg-slate-600 text-slate-400 hover:text-slate-100 border border-slate-700/60 rounded-lg cursor-pointer transition-all flex items-center justify-center ml-0.5" title="Reset ke Center">
        <i data-lucide="crosshair" class="w-3.5 h-3.5"></i>
      </button>
    </div>

  </div>

</div>
`;
