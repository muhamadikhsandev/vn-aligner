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

          <!-- Garis Presisi Tab -->
          <button @click="showGuidelines = !showGuidelines; renderPreview()"
                  class="text-[10px] px-3 py-1.5 font-bold flex items-center gap-1.5 shrink-0 whitespace-nowrap rounded-xl transition-all cursor-pointer"
                  :class="showGuidelines
                    ? 'bg-cyan-500/20 text-cyan-300 shadow-sm shadow-cyan-500/20'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'">
            <i data-lucide="crosshair" class="w-3 h-3"></i> Presisi
          </button>

          <!-- Box Tab -->
          <button @click="showBox = !showBox; renderPreview()"
                  class="text-[10px] px-3 py-1.5 font-bold flex items-center gap-1.5 shrink-0 whitespace-nowrap rounded-xl transition-all cursor-pointer"
                  :class="showBox
                    ? 'bg-sky-500/20 text-sky-300 shadow-sm shadow-sky-500/20'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'">
            <i data-lucide="box" class="w-3 h-3"></i> Box
          </button>


          <!-- Divider -->
          <div class="w-px h-5 bg-slate-700/60 mx-0.5 shrink-0"></div>

          <!-- Mode Drag Tab -->
          <button @click="toggleDragMode()"
                  class="text-[10px] px-3 py-1.5 font-bold flex items-center gap-1.5 shrink-0 whitespace-nowrap rounded-xl transition-all cursor-pointer"
                  :class="isDragEnabled && !lockImagePosition
                    ? 'bg-emerald-500/20 text-emerald-300 shadow-sm shadow-emerald-500/20'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'"
                  title="Aktifkan / Nonaktifkan Mode Drag Geser Gambar">
            <i data-lucide="hand" class="w-3 h-3"></i>
            <span x-text="isDragEnabled && !lockImagePosition ? 'Drag ON' : 'Mode Drag'"></span>
          </button>

          <!-- Kunci Posisi Tab -->
          <button @click="toggleLockImagePosition()"
                  class="text-[10px] px-3 py-1.5 font-bold flex items-center gap-1.5 shrink-0 whitespace-nowrap rounded-xl transition-all cursor-pointer"
                  :class="lockImagePosition
                    ? 'bg-amber-500/20 text-amber-300 shadow-sm shadow-amber-500/20'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'">
            <i x-show="lockImagePosition" data-lucide="lock" class="w-3 h-3"></i>
            <i x-show="!lockImagePosition" data-lucide="unlock" class="w-3 h-3"></i>
            <span x-text="lockImagePosition ? 'Terkunci' : 'Kunci'"></span>
          </button>

          <!-- Brush Hapus Tab -->
          <button @click="toggleEraserBrush()"
                  class="text-[10px] px-3 py-1.5 font-bold flex items-center gap-1.5 shrink-0 whitespace-nowrap rounded-xl transition-all cursor-pointer"
                  :class="isEraserActive
                    ? 'bg-rose-500/25 text-rose-300 shadow-sm shadow-rose-500/20 animate-pulse'
                    : 'text-slate-500 hover:text-rose-300 hover:bg-slate-800/60'">
            <i data-lucide="eraser" class="w-3 h-3"></i>
            <span x-text="isEraserActive ? 'Brush ON' : 'Hapus'"></span>
          </button>

          <!-- Divider -->
          <div class="w-px h-5 bg-slate-700/60 mx-0.5 shrink-0"></div>

          <!-- Sembunyikan Overlay Tab -->
          <button @click="hideAllOverlays = !hideAllOverlays; renderPreview()"
                  class="text-[10px] px-3 py-1.5 font-bold flex items-center gap-1.5 shrink-0 whitespace-nowrap rounded-xl transition-all cursor-pointer"
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
                  class="max-w-full max-h-full object-contain touch-none cursor-pen-edit"></canvas>
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

  <!-- BOTTOM CAROUSEL THUMB BAR WITH QUICK INPUTS & LIVE PERCENTAGES -->
  <div x-show="bodyAssetList.length > 0 || faceAssetList.length > 0" class="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-1.5 mt-1 shrink-0 flex flex-col gap-1.5 z-20">

    <!-- BADAN CAROUSEL -->
    <div x-show="bodyAssetList.length > 0" class="flex flex-col gap-1">
      <div class="flex items-center justify-between text-[10px] text-slate-400 px-1">
        <div class="flex items-center gap-1.5">
          <span class="font-medium text-blue-300 flex items-center gap-1">
            <i data-lucide="user" class="w-3.5 h-3.5 text-blue-400"></i> Badan
          </span>
          <button @click="togglePlayBody()" class="px-2 py-0.5 rounded text-[9px] font-semibold text-white cursor-pointer"
                  :class="isPlayingBody ? 'bg-rose-600 animate-pulse' : 'bg-blue-700'">
            <span x-text="isPlayingBody ? 'Stop' : 'Play'"></span>
          </button>
        </div>
        <span class="font-mono text-blue-400 font-bold" x-text="(activeBodyIndex + 1) + '/' + bodyAssetList.length"></span>
      </div>

      <!-- Quick-input bar for active body -->
      <div class="flex items-center gap-1.5 px-1 flex-wrap" @click.stop>
        <label class="flex items-center gap-0.5">
          <span class="text-[9px] font-bold text-blue-400 shrink-0">Skala%</span>
          <input type="number"
                 :value="currentBodyTransform ? currentBodyTransform.scale : 100"
                 @change.stop="activeTarget='body'; updateBodyTransform('scale', $event.target.value); pushHistoryState()"
                 @click.stop
                 class="w-14 text-[9px] font-mono bg-blue-950/80 border border-blue-700/60 text-blue-200 rounded px-1 py-0.5 text-center focus:outline-none focus:ring-1 focus:ring-blue-400"
                 min="1" max="5000" step="1" />
        </label>
        <label class="flex items-center gap-0.5">
          <span class="text-[9px] font-bold text-slate-400 shrink-0">X</span>
          <input type="number"
                 :value="currentBodyTransform ? currentBodyTransform.offsetX : 0"
                 @change.stop="activeTarget='body'; updateBodyTransform('offsetX', $event.target.value); pushHistoryState()"
                 @click.stop
                 class="w-14 text-[9px] font-mono bg-slate-800/80 border border-slate-700/60 text-slate-200 rounded px-1 py-0.5 text-center focus:outline-none focus:ring-1 focus:ring-blue-400"
                 min="-3000" max="3000" step="1" />
        </label>
        <label class="flex items-center gap-0.5">
          <span class="text-[9px] font-bold text-slate-400 shrink-0">Y</span>
          <input type="number"
                 :value="currentBodyTransform ? currentBodyTransform.offsetY : 0"
                 @change.stop="activeTarget='body'; updateBodyTransform('offsetY', $event.target.value); pushHistoryState()"
                 @click.stop
                 class="w-14 text-[9px] font-mono bg-slate-800/80 border border-slate-700/60 text-slate-200 rounded px-1 py-0.5 text-center focus:outline-none focus:ring-1 focus:ring-blue-400"
                 min="-3000" max="3000" step="1" />
        </label>
        <label class="flex items-center gap-0.5">
          <span class="text-[9px] font-bold text-indigo-400 shrink-0">°</span>
          <input type="number"
                 :value="currentBodyTransform ? currentBodyTransform.rotation : 0"
                 @change.stop="activeTarget='body'; updateBodyTransform('rotation', $event.target.value); pushHistoryState()"
                 @click.stop
                 class="w-14 text-[9px] font-mono bg-indigo-950/80 border border-indigo-700/60 text-indigo-200 rounded px-1 py-0.5 text-center focus:outline-none focus:ring-1 focus:ring-indigo-400"
                 min="-180" max="180" step="1" />
        </label>
      </div>

      <!-- Thumbnail strip -->
      <div class="flex items-end gap-2 overflow-x-auto pb-1 px-1 no-scrollbar">
        <template x-for="(item, index) in bodyAssetList" :key="item.id">
          <div @click="selectBody(index)"
               class="relative flex-shrink-0 border cursor-pointer rounded-lg overflow-hidden bg-slate-950 flex flex-col items-center transition-all min-w-[56px]"
               :class="index === activeBodyIndex ? 'border-blue-400 ring-2 ring-blue-500/50 scale-105' : 'border-slate-800 opacity-55 hover:opacity-80'">
            <div class="w-12 h-12 overflow-hidden">
              <img :src="item.thumb" class="w-full h-full object-cover" />
            </div>
            <div class="w-full bg-slate-900/95 px-0.5 pt-0.5 pb-0.5 flex flex-col gap-px">
              <template x-if="index === activeBodyIndex">
                <div class="flex items-center gap-0.5" @click.stop>
                  <span class="text-[7px] text-blue-400 font-bold shrink-0">%</span>
                  <input type="number"
                         :value="bodyMode === 'global' ? globalBodyTransform.scale : (item.transform ? item.transform.scale : 100)"
                         @change.stop="activeTarget='body'; updateBodyTransform('scale', $event.target.value); pushHistoryState()"
                         @click.stop
                         class="w-full text-[9px] font-mono bg-blue-950/80 border border-blue-700/60 text-blue-200 rounded px-0.5 py-px text-center focus:outline-none focus:ring-1 focus:ring-blue-400"
                         min="1" max="5000" step="1" />
                </div>
              </template>
              <template x-if="index !== activeBodyIndex">
                <div class="text-center">
                  <span class="text-[8px] font-mono text-blue-400 font-bold"
                        x-text="(bodyMode === 'global' ? globalBodyTransform.scale : (item.transform ? item.transform.scale : 100)) + '%'"></span>
                </div>
              </template>
              <div class="flex items-center justify-center gap-1">
                <span class="text-[7px] font-mono text-slate-500"
                      x-text="'X' + (bodyMode === 'global' ? globalBodyTransform.offsetX : (item.transform ? item.transform.offsetX : 0))"></span>
                <span class="text-[7px] font-mono text-slate-500"
                      x-text="'Y' + (bodyMode === 'global' ? globalBodyTransform.offsetY : (item.transform ? item.transform.offsetY : 0))"></span>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- WAJAH CAROUSEL -->
    <div x-show="faceAssetList.length > 0" class="flex flex-col gap-1">
      <div class="flex items-center justify-between text-[10px] text-slate-400 px-1">
        <div class="flex items-center gap-1.5">
          <span class="font-medium text-emerald-300 flex items-center gap-1">
            <i data-lucide="smile" class="w-3.5 h-3.5 text-emerald-400"></i> Wajah
          </span>
          <button @click="togglePlayFace()" class="px-2 py-0.5 rounded text-[9px] font-semibold text-white cursor-pointer"
                  :class="isPlayingFace ? 'bg-rose-600 animate-pulse' : 'bg-emerald-700'">
            <span x-text="isPlayingFace ? 'Stop' : 'Play'"></span>
          </button>
        </div>
        <span class="font-mono text-emerald-400 font-bold" x-text="(activeFaceIndex + 1) + '/' + faceAssetList.length"></span>
      </div>

      <!-- Quick-input bar for active face -->
      <div class="flex items-center gap-1.5 px-1 flex-wrap" @click.stop>
        <label class="flex items-center gap-0.5">
          <span class="text-[9px] font-bold text-emerald-400 shrink-0">Skala%</span>
          <input type="number"
                 :value="currentFaceTransform ? currentFaceTransform.scale : 100"
                 @change.stop="activeTarget='face'; updateFaceTransform('scale', $event.target.value); pushHistoryState()"
                 @click.stop
                 class="w-14 text-[9px] font-mono bg-emerald-950/80 border border-emerald-700/60 text-emerald-200 rounded px-1 py-0.5 text-center focus:outline-none focus:ring-1 focus:ring-emerald-400"
                 min="1" max="5000" step="1" />
        </label>
        <label class="flex items-center gap-0.5">
          <span class="text-[9px] font-bold text-slate-400 shrink-0">X</span>
          <input type="number"
                 :value="currentFaceTransform ? currentFaceTransform.offsetX : 0"
                 @change.stop="activeTarget='face'; updateFaceTransform('offsetX', $event.target.value); pushHistoryState()"
                 @click.stop
                 class="w-14 text-[9px] font-mono bg-slate-800/80 border border-slate-700/60 text-slate-200 rounded px-1 py-0.5 text-center focus:outline-none focus:ring-1 focus:ring-emerald-400"
                 min="-3000" max="3000" step="1" />
        </label>
        <label class="flex items-center gap-0.5">
          <span class="text-[9px] font-bold text-slate-400 shrink-0">Y</span>
          <input type="number"
                 :value="currentFaceTransform ? currentFaceTransform.offsetY : 0"
                 @change.stop="activeTarget='face'; updateFaceTransform('offsetY', $event.target.value); pushHistoryState()"
                 @click.stop
                 class="w-14 text-[9px] font-mono bg-slate-800/80 border border-slate-700/60 text-slate-200 rounded px-1 py-0.5 text-center focus:outline-none focus:ring-1 focus:ring-emerald-400"
                 min="-3000" max="3000" step="1" />
        </label>
        <label class="flex items-center gap-0.5">
          <span class="text-[9px] font-bold text-pink-400 shrink-0">SX%</span>
          <input type="number"
                 :value="currentFaceTransform && currentFaceTransform.stretchX !== undefined ? currentFaceTransform.stretchX : 100"
                 @change.stop="activeTarget='face'; updateFaceTransform('stretchX', $event.target.value); pushHistoryState()"
                 @click.stop
                 class="w-14 text-[9px] font-mono bg-pink-950/80 border border-pink-700/60 text-pink-200 rounded px-1 py-0.5 text-center focus:outline-none focus:ring-1 focus:ring-pink-400"
                 min="10" max="500" step="1" />
        </label>
        <label class="flex items-center gap-0.5">
          <span class="text-[9px] font-bold text-pink-400 shrink-0">SY%</span>
          <input type="number"
                 :value="currentFaceTransform && currentFaceTransform.stretchY !== undefined ? currentFaceTransform.stretchY : 100"
                 @change.stop="activeTarget='face'; updateFaceTransform('stretchY', $event.target.value); pushHistoryState()"
                 @click.stop
                 class="w-14 text-[9px] font-mono bg-pink-950/80 border border-pink-700/60 text-pink-200 rounded px-1 py-0.5 text-center focus:outline-none focus:ring-1 focus:ring-pink-400"
                 min="10" max="500" step="1" />
        </label>
        <label class="flex items-center gap-0.5">
          <span class="text-[9px] font-bold text-indigo-400 shrink-0">°</span>
          <input type="number"
                 :value="currentFaceTransform ? currentFaceTransform.rotation : 0"
                 @change.stop="activeTarget='face'; updateFaceTransform('rotation', $event.target.value); pushHistoryState()"
                 @click.stop
                 class="w-14 text-[9px] font-mono bg-indigo-950/80 border border-indigo-700/60 text-indigo-200 rounded px-1 py-0.5 text-center focus:outline-none focus:ring-1 focus:ring-indigo-400"
                 min="-180" max="180" step="1" />
        </label>
      </div>

      <!-- Thumbnail strip -->
      <div class="flex items-end gap-2 overflow-x-auto pb-1 px-1 no-scrollbar">
        <template x-for="(item, index) in faceAssetList" :key="item.id">
          <div @click="selectFace(index)"
               class="relative flex-shrink-0 border cursor-pointer rounded-lg overflow-hidden bg-slate-950 flex flex-col items-center transition-all min-w-[56px]"
               :class="index === activeFaceIndex ? 'border-emerald-500 ring-2 ring-emerald-500/50 scale-105' : 'border-slate-800 opacity-55 hover:opacity-80'">
            <div class="w-12 h-12 overflow-hidden">
              <img :src="item.thumb" class="w-full h-full object-cover" />
            </div>
            <div class="w-full bg-slate-900/95 px-0.5 pt-0.5 pb-0.5 flex flex-col gap-px">
              <template x-if="index === activeFaceIndex">
                <div class="flex items-center gap-0.5" @click.stop>
                  <span class="text-[7px] text-emerald-400 font-bold shrink-0">%</span>
                  <input type="number"
                         :value="faceMode === 'global' ? globalFaceTransform.scale : (item.transform ? item.transform.scale : 100)"
                         @change.stop="activeTarget='face'; updateFaceTransform('scale', $event.target.value); pushHistoryState()"
                         @click.stop
                         class="w-full text-[9px] font-mono bg-emerald-950/80 border border-emerald-700/60 text-emerald-200 rounded px-0.5 py-px text-center focus:outline-none focus:ring-1 focus:ring-emerald-400"
                         min="1" max="5000" step="1" />
                </div>
              </template>
              <template x-if="index !== activeFaceIndex">
                <div class="text-center">
                  <span class="text-[8px] font-mono text-emerald-400 font-bold"
                        x-text="(faceMode === 'global' ? globalFaceTransform.scale : (item.transform ? item.transform.scale : 100)) + '%'"></span>
                </div>
              </template>
              <div class="flex items-center justify-center gap-1">
                <span class="text-[7px] font-mono text-slate-500"
                      x-text="'X' + (faceMode === 'global' ? globalFaceTransform.offsetX : (item.transform ? item.transform.offsetX : 0))"></span>
                <span class="text-[7px] font-mono text-slate-500"
                      x-text="'Y' + (faceMode === 'global' ? globalFaceTransform.offsetY : (item.transform ? item.transform.offsetY : 0))"></span>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

  </div>

</div>
`;
