// js/templates/preview.js
// Preview canvas component HTML template (Full height & width focused canvas preview)

export const previewHTML = `
<div class="lg:col-span-8 flex-1 flex flex-col relative overflow-hidden h-full w-full min-h-0">

  <!-- CANVAS VIEWPORT CONTAINER (FULL CHECKERBOARD CANVAS AREA - NO EXTRA OUTER WRAPPER PADDING) -->
  <div class="relative flex-1 w-full h-full flex flex-col overflow-hidden border border-slate-800 rounded-xl checkerboard-bg min-h-0 shadow-2xl">
    
    <!-- TOP TOOLBAR — PILL TAB GROUP STYLE -->
    <div class="w-full flex items-center justify-between px-2 py-1.5 shrink-0 gap-2 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/60">

      <!-- LEFT: MODE DROPDOWN CUSTOM (PINNED OUTSIDE OVERFLOW WRAPPER TO PREVENT CLIPPING) -->
      <div class="relative shrink-0 z-50" @click.outside="isModeDropdownOpen = false">
        <!-- Trigger Button -->
        <button @click="isModeDropdownOpen = !isModeDropdownOpen" type="button"
                class="text-[10px] px-3 py-1.5 font-bold flex items-center gap-1.5 whitespace-nowrap rounded-2xl transition-all cursor-pointer border shadow-md"
                :class="canvasInteractionMode === 'drag'
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-500/30'
                  : canvasInteractionMode === 'transform'
                    ? 'bg-cyan-600 text-white border-cyan-500 shadow-cyan-500/30'
                    : canvasInteractionMode === 'shape'
                      ? 'bg-pink-600 text-white border-pink-500 shadow-pink-500/30'
                      : 'bg-indigo-600 text-white border-indigo-500 shadow-indigo-500/30'"
                title="Pilih Mode Interaksi Canvas">
          <i x-show="canvasInteractionMode === 'drag'" data-lucide="hand" class="w-3.5 h-3.5"></i>
          <i x-show="canvasInteractionMode === 'transform'" data-lucide="box" class="w-3.5 h-3.5"></i>
          <i x-show="canvasInteractionMode === 'shape'" data-lucide="pen-tool" class="w-3.5 h-3.5"></i>
          <i x-show="canvasInteractionMode === 'rotation'" data-lucide="rotate-cw" class="w-3.5 h-3.5"></i>
          <span x-text="canvasInteractionMode === 'drag' ? 'Mode Drag' : canvasInteractionMode === 'transform' ? 'Mode Transform' : canvasInteractionMode === 'shape' ? 'Mode Bentuk' : 'Mode Rotasi'"></span>
          <i data-lucide="chevron-down" class="w-3 h-3 opacity-70"></i>
        </button>

        <!-- Dropdown Panel -->
        <div x-show="isModeDropdownOpen"
             class="absolute left-0 top-full mt-1.5 w-56 bg-slate-900/98 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl z-50 py-1.5 overflow-hidden">

          <!-- Mode Drag -->
          <button @click="setModeDrag(); isModeDropdownOpen = false" type="button"
                  class="w-full px-3.5 py-2.5 text-[10px] font-bold cursor-pointer flex items-center gap-2.5 transition-all hover:bg-slate-800"
                  :class="canvasInteractionMode === 'drag' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400'">
            <div class="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                 :class="canvasInteractionMode === 'drag' ? 'bg-emerald-600' : 'bg-slate-800'">
              <i data-lucide="hand" class="w-3.5 h-3.5 text-white"></i>
            </div>
            <div class="text-left flex-1">
              <div>Mode Drag</div>
              <div class="text-[9px] opacity-50 font-normal">Geser posisi aset gambar</div>
            </div>
            <i x-show="canvasInteractionMode === 'drag'" data-lucide="check" class="w-3.5 h-3.5 text-emerald-400 shrink-0"></i>
          </button>

          <!-- Mode Transform -->
          <button @click="setModeTransform(); isModeDropdownOpen = false" type="button"
                  class="w-full px-3.5 py-2.5 text-[10px] font-bold cursor-pointer flex items-center gap-2.5 transition-all hover:bg-slate-800"
                  :class="canvasInteractionMode === 'transform' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'">
            <div class="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                 :class="canvasInteractionMode === 'transform' ? 'bg-cyan-600' : 'bg-slate-800'">
              <i data-lucide="box" class="w-3.5 h-3.5 text-white"></i>
            </div>
            <div class="text-left flex-1">
              <div>Mode Transform</div>
              <div class="text-[9px] opacity-50 font-normal">Skala, resize 8 titik sudut</div>
            </div>
            <i x-show="canvasInteractionMode === 'transform'" data-lucide="check" class="w-3.5 h-3.5 text-cyan-400 shrink-0"></i>
          </button>

          <!-- Mode Bentuk -->
          <button @click="setModeShape(); isModeDropdownOpen = false" type="button"
                  class="w-full px-3.5 py-2.5 text-[10px] font-bold cursor-pointer flex items-center gap-2.5 transition-all hover:bg-slate-800"
                  :class="canvasInteractionMode === 'shape' ? 'bg-pink-500/20 text-pink-300' : 'text-slate-400'">
            <div class="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                 :class="canvasInteractionMode === 'shape' ? 'bg-pink-600' : 'bg-slate-800'">
              <i data-lucide="pen-tool" class="w-3.5 h-3.5 text-white"></i>
            </div>
            <div class="text-left flex-1">
              <div>Mode Bentuk</div>
              <div class="text-[9px] opacity-50 font-normal">Bentuk kontur wajah bebas</div>
            </div>
            <i x-show="canvasInteractionMode === 'shape'" data-lucide="check" class="w-3.5 h-3.5 text-pink-400 shrink-0"></i>
          </button>

          <!-- Mode Rotasi -->
          <button @click="setModeRotation(); isModeDropdownOpen = false" type="button"
                  class="w-full px-3.5 py-2.5 text-[10px] font-bold cursor-pointer flex items-center gap-2.5 transition-all hover:bg-slate-800"
                  :class="canvasInteractionMode === 'rotation' ? 'bg-indigo-500/20 text-indigo-300' : 'text-slate-400'">
            <div class="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                 :class="canvasInteractionMode === 'rotation' ? 'bg-indigo-600' : 'bg-slate-800'">
              <i data-lucide="rotate-cw" class="w-3.5 h-3.5 text-white"></i>
            </div>
            <div class="text-left flex-1">
              <div>Mode Rotasi</div>
              <div class="text-[9px] opacity-50 font-normal">Putar &amp; atur rotasi aset</div>
            </div>
            <i x-show="canvasInteractionMode === 'rotation'" data-lucide="check" class="w-3.5 h-3.5 text-indigo-400 shrink-0"></i>
          </button>

        </div>
      </div>

      <!-- CENTER: TOGGLE TABS IN SCROLLABLE CONTAINER -->
      <div class="flex-1 min-w-0 overflow-x-auto no-scrollbar touch-pan-x">
        <div class="flex items-center gap-1 bg-slate-900/80 border border-slate-700/60 rounded-2xl p-1 w-fit min-w-full sm:min-w-0 shadow-inner">

          <!-- Live Badge -->
          <span class="text-[10px] text-blue-400 font-bold px-2.5 py-1.5 flex items-center gap-1 shrink-0 whitespace-nowrap opacity-80">
            <i data-lucide="sparkles" class="w-3 h-3"></i>
          </span>

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
