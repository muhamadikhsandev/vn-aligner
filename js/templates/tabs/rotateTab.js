export const rotateTabHTML = `
<!-- TAB: ROTASI & FLIP -->
<div x-show="activeTab === 'rotate'" class="flex flex-col gap-2">
  <div class="bg-indigo-950/40 p-2.5 rounded-xl border border-indigo-800/60 flex flex-col gap-2 shadow-lg">
    
    <div class="flex items-center justify-between">
      <span class="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
        <i data-lucide="rotate-cw" class="w-4 h-4 text-indigo-400"></i> Rotasi &amp; Cermin (Flip)
      </span>
      <button @click="resetRotationFlip()" class="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded text-[9px] font-bold cursor-pointer transition-all">
        Reset Rotasi
      </button>
    </div>

    <!-- Target Switcher (Face vs Body) -->
    <div class="flex items-center justify-between bg-slate-950/80 p-1.5 rounded-lg border border-slate-800">
      <span class="text-[10px] text-slate-400 font-medium">Target Pengaturan:</span>
      <div class="flex items-center gap-1">
        <button @click="activeTarget = 'face'" class="px-2 py-0.5 rounded text-[9px] font-bold border transition-all cursor-pointer" :class="activeTarget === 'face' ? 'bg-indigo-600 border-indigo-400 text-white shadow' : 'bg-slate-900 border-slate-800 text-slate-400'">Wajah</button>
        <button @click="activeTarget = 'body'" class="px-2 py-0.5 rounded text-[9px] font-bold border transition-all cursor-pointer" :class="activeTarget === 'body' ? 'bg-indigo-600 border-indigo-400 text-white shadow' : 'bg-slate-900 border-slate-800 text-slate-400'">Badan</button>
      </div>
    </div>

    <!-- Quick Preset Rotate Buttons -->
    <div class="flex flex-col gap-1 bg-slate-950/80 p-2 rounded-lg border border-slate-800">
      <span class="text-[10px] font-semibold text-slate-300 flex items-center gap-1">
        <i data-lucide="refresh-cw" class="w-3 h-3 text-indigo-400"></i> Putar Sudut Cepat:
      </span>
      <div class="grid grid-cols-4 gap-1">
        <button @click="rotateBy(-90)" class="px-2 py-1.5 bg-slate-900 hover:bg-indigo-900/60 border border-slate-700 text-indigo-300 rounded text-[10px] font-bold cursor-pointer transition-all flex flex-col items-center justify-center gap-0.5 shadow-sm">
          <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>-90°
        </button>
        <button @click="setRotation(0)" class="px-2 py-1.5 bg-slate-900 hover:bg-indigo-900/60 border border-slate-700 text-indigo-300 rounded text-[10px] font-bold cursor-pointer transition-all flex flex-col items-center justify-center gap-0.5 shadow-sm">
          <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i>0°
        </button>
        <button @click="rotateBy(90)" class="px-2 py-1.5 bg-slate-900 hover:bg-indigo-900/60 border border-slate-700 text-indigo-300 rounded text-[10px] font-bold cursor-pointer transition-all flex flex-col items-center justify-center gap-0.5 shadow-sm">
          <i data-lucide="rotate-cw" class="w-3.5 h-3.5"></i>+90°
        </button>
        <button @click="rotateBy(180)" class="px-2 py-1.5 bg-slate-900 hover:bg-indigo-900/60 border border-slate-700 text-indigo-300 rounded text-[10px] font-bold cursor-pointer transition-all flex flex-col items-center justify-center gap-0.5 shadow-sm">
          <i data-lucide="repeat" class="w-3.5 h-3.5"></i>180°
        </button>
      </div>
    </div>

    <!-- Fine Tune Slider (-180..180) -->
    <div class="bg-slate-950/80 p-2 rounded-lg border border-slate-800 flex flex-col gap-1.5">
      <div class="flex justify-between items-center text-[10px]">
        <span class="text-slate-300 font-semibold">Sudut Presisi:</span>
        <span class="font-mono text-indigo-400 font-bold" x-text="(currentTransform.rotation || 0) + '°'"></span>
      </div>
      <input type="range" min="-180" max="180" :value="currentTransform.rotation || 0" @input="updateTransform('rotation', parseInt($event.target.value))" @change="pushHistoryState()" class="w-full accent-indigo-500 bg-slate-800 h-1.5 rounded cursor-pointer">
    </div>

    <!-- Flip Controls -->
    <div class="bg-slate-950/80 p-2 rounded-lg border border-slate-800 flex flex-col gap-1.5">
      <span class="text-[10px] font-semibold text-slate-300 flex items-center gap-1">
        <i data-lucide="flip-horizontal" class="w-3 h-3 text-indigo-400"></i> Cermin / Flip Gambar:
      </span>
      <div class="grid grid-cols-2 gap-1.5">
        <button @click="toggleFlip('flipH')" class="px-2 py-2 rounded-lg border text-[10px] font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all" :class="currentTransform.flipH ? 'bg-indigo-600 border-indigo-400 text-white shadow' : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'">
          <i data-lucide="flip-horizontal" class="w-4 h-4"></i> Flip Horisontal
        </button>
        <button @click="toggleFlip('flipV')" class="px-2 py-2 rounded-lg border text-[10px] font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all" :class="currentTransform.flipV ? 'bg-indigo-600 border-indigo-400 text-white shadow' : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'">
          <i data-lucide="flip-vertical" class="w-4 h-4"></i> Flip Vertikal
        </button>
      </div>
    </div>

  </div>
</div>
`;
