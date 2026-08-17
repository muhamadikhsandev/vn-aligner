export const boxTabHTML = `
<!-- TAB: MODE BOX SUPER LENGKAP -->
<div x-show="activeTab === 'box'" class="flex flex-col gap-1.5">
  <div class="bg-cyan-950/40 p-2 rounded-xl border border-cyan-800/60 flex flex-col gap-1.5 shadow-lg">
    <div class="flex items-center justify-between gap-1">
      <span class="text-xs font-bold text-cyan-300 flex items-center gap-1.5"><i data-lucide="box" class="w-3.5 h-3.5 text-cyan-400"></i> Mode Box Super Lengkap</span>
      <button @click="resetBox()" class="px-1.5 py-0.5 bg-slate-900 text-slate-300 border border-slate-800 rounded text-[9px] font-bold cursor-pointer">Reset</button>
    </div>

    <div class="flex items-center justify-between bg-slate-950 p-1 rounded-lg border border-slate-800">
      <span class="text-[10px] text-slate-300">Target Box:</span>
      <div class="flex items-center gap-1">
        <button @click="activeTarget = 'face'; renderPreview()" class="px-2 py-0.5 text-[9px] font-bold rounded" :class="activeTarget === 'face' ? 'bg-emerald-600 text-white' : 'text-slate-400'">Wajah</button>
        <button @click="activeTarget = 'body'; renderPreview()" class="px-2 py-0.5 text-[9px] font-bold rounded" :class="activeTarget === 'body' ? 'bg-blue-600 text-white' : 'text-slate-400'">Badan</button>
      </div>
    </div>

    <!-- 3x3 TITIK SUDUT ANCHOR GRID -->
    <div class="bg-slate-950/80 p-1.5 rounded-lg border border-slate-800 flex flex-col gap-1">
      <span class="text-[9px] font-semibold text-cyan-300">Titik Sudut Acuan:</span>
      <div class="grid grid-cols-3 gap-1 w-full max-w-[190px] mx-auto bg-slate-900 p-1 rounded-lg border border-slate-800">
        <button @click="setCornerAnchor('nw')" class="py-0.5 rounded text-[8px] font-bold border flex items-center justify-center gap-0.5" :class="boxAnchor === 'nw' ? 'bg-cyan-600 text-white border-cyan-400' : 'bg-slate-950 border-slate-800 text-slate-400'"><i data-lucide="arrow-up-left" class="w-2.5 h-2.5"></i> NW</button>
        <button @click="setCornerAnchor('n')" class="py-0.5 rounded text-[8px] font-bold border flex items-center justify-center gap-0.5" :class="boxAnchor === 'n' ? 'bg-cyan-600 text-white border-cyan-400' : 'bg-slate-950 border-slate-800 text-slate-400'"><i data-lucide="arrow-up" class="w-2.5 h-2.5"></i> N</button>
        <button @click="setCornerAnchor('ne')" class="py-0.5 rounded text-[8px] font-bold border flex items-center justify-center gap-0.5" :class="boxAnchor === 'ne' ? 'bg-cyan-600 text-white border-cyan-400' : 'bg-slate-950 border-slate-800 text-slate-400'"><i data-lucide="arrow-up-right" class="w-2.5 h-2.5"></i> NE</button>
        <button @click="setCornerAnchor('w')" class="py-0.5 rounded text-[8px] font-bold border flex items-center justify-center gap-0.5" :class="boxAnchor === 'w' ? 'bg-cyan-600 text-white border-cyan-400' : 'bg-slate-950 border-slate-800 text-slate-400'"><i data-lucide="arrow-left" class="w-2.5 h-2.5"></i> W</button>
        <button @click="setCornerAnchor('center')" class="py-0.5 rounded text-[8px] font-bold border flex items-center justify-center gap-0.5" :class="boxAnchor === 'center' ? 'bg-cyan-600 text-white border-cyan-400' : 'bg-slate-950 border-slate-800 text-slate-400'"><i data-lucide="crosshair" class="w-2.5 h-2.5"></i> C</button>
        <button @click="setCornerAnchor('e')" class="py-0.5 rounded text-[8px] font-bold border flex items-center justify-center gap-0.5" :class="boxAnchor === 'e' ? 'bg-cyan-600 text-white border-cyan-400' : 'bg-slate-950 border-slate-800 text-slate-400'"><i data-lucide="arrow-right" class="w-2.5 h-2.5"></i> E</button>
        <button @click="setCornerAnchor('sw')" class="py-0.5 rounded text-[8px] font-bold border flex items-center justify-center gap-0.5" :class="boxAnchor === 'sw' ? 'bg-cyan-600 text-white border-cyan-400' : 'bg-slate-950 border-slate-800 text-slate-400'"><i data-lucide="arrow-down-left" class="w-2.5 h-2.5"></i> SW</button>
        <button @click="setCornerAnchor('s')" class="py-0.5 rounded text-[8px] font-bold border flex items-center justify-center gap-0.5" :class="boxAnchor === 's' ? 'bg-cyan-600 text-white border-cyan-400' : 'bg-slate-950 border-slate-800 text-slate-400'"><i data-lucide="arrow-down" class="w-2.5 h-2.5"></i> S</button>
        <button @click="setCornerAnchor('se')" class="py-0.5 rounded text-[8px] font-bold border flex items-center justify-center gap-0.5" :class="boxAnchor === 'se' ? 'bg-cyan-600 text-white border-cyan-400' : 'bg-slate-950 border-slate-800 text-slate-400'"><i data-lucide="arrow-down-right" class="w-2.5 h-2.5"></i> SE</button>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-1">
      <div class="bg-slate-950/70 p-1.5 rounded-lg border border-slate-800 flex flex-col gap-0.5">
        <span class="text-[9px] text-slate-400">Lebar (W px):</span>
        <input type="number" min="1" max="10000" :value="currentBoxWidth" @input="updateBoxDimension('w', \$event.target.value)" class="w-full bg-slate-900 border border-slate-800 text-center text-cyan-300 text-xs py-0.5 font-bold">
      </div>
      <div class="bg-slate-950/70 p-1.5 rounded-lg border border-slate-800 flex flex-col gap-0.5">
        <span class="text-[9px] text-slate-400">Tinggi (H px):</span>
        <input type="number" min="1" max="10000" :value="currentBoxHeight" @input="updateBoxDimension('h', \$event.target.value)" class="w-full bg-slate-900 border border-slate-800 text-center text-cyan-300 text-xs py-0.5 font-bold">
      </div>
    </div>

    <div class="bg-slate-950/70 p-1.5 rounded-lg border border-slate-800 flex flex-col gap-1">
      <div class="flex justify-between text-[10px]"><span class="text-slate-300">Skala Utama:</span><input type="number" min="1" max="5000" :value="activeTarget === 'face' ? currentFaceTransform.scale : currentBodyTransform.scale" @input="activeTarget === 'face' ? updateFaceTransform('scale', \$event.target.value) : updateBodyTransform('scale', \$event.target.value); pushHistoryState()" class="w-12 bg-slate-900 border border-slate-800 rounded text-center text-cyan-400 text-[10px] py-0.5 font-bold"></div>
      <input type="range" min="1" max="1000" :value="activeTarget === 'face' ? currentFaceTransform.scale : currentBodyTransform.scale" @input="activeTarget === 'face' ? updateFaceTransform('scale', \$event.target.value) : updateBodyTransform('scale', \$event.target.value)" @change="pushHistoryState()" class="w-full accent-cyan-500 bg-slate-800 h-1.5 rounded cursor-pointer">
    </div>

    <div class="grid grid-cols-3 gap-1">
      <button @click="alignBox('centerBoth')" class="py-1 bg-slate-900 text-slate-200 rounded text-[9px] font-bold border border-slate-800 flex items-center justify-center gap-0.5"><i data-lucide="crosshair" class="w-2.5 h-2.5"></i> Center X&amp;Y</button>
      <button @click="alignBox('centerX')" class="py-1 bg-slate-900 text-slate-200 rounded text-[9px] font-bold border border-slate-800 flex items-center justify-center gap-0.5"><i data-lucide="align-horizontal-justify-center" class="w-2.5 h-2.5"></i> Center X</button>
      <button @click="alignBox('centerY')" class="py-1 bg-slate-900 text-slate-200 rounded text-[9px] font-bold border border-slate-800 flex items-center justify-center gap-0.5"><i data-lucide="align-vertical-justify-center" class="w-2.5 h-2.5"></i> Center Y</button>
    </div>
  </div>
</div>
`;
