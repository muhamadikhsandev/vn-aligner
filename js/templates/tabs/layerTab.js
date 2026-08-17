export const layerTabHTML = `
<!-- TAB: LAYER -->
<div x-show="activeTab === 'layer'" class="flex flex-col gap-1.5">
  <div class="bg-purple-950/30 p-2 rounded-xl border border-purple-800/50 flex flex-col gap-1.5">
    <div class="flex items-center justify-between">
      <span class="text-xs font-bold text-purple-300 flex items-center gap-1.5"><i data-lucide="layers" class="w-3.5 h-3.5 text-purple-400"></i> Urutan Layer</span>
      <div class="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800">
        <button @click="setLayerMode('global')" class="px-2 py-0.5 text-[9px] font-bold rounded min-h-[24px]" :class="layerMode === 'global' ? 'bg-purple-600 text-white' : 'text-slate-400'">Semua</button>
        <button @click="setLayerMode('individual')" class="px-2 py-0.5 text-[9px] font-bold rounded min-h-[24px]" :class="layerMode === 'individual' ? 'bg-purple-600 text-white' : 'text-slate-400'">Satuan</button>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-1.5 pt-0.5">
      <button @click="setFaceLayerOrder('below')" class="px-2 py-2 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all min-h-[36px]" :class="currentFaceLayerOrder === 'below' ? 'bg-purple-600 border-purple-400 text-white shadow' : 'bg-slate-950 border-slate-800 text-slate-300'"><i data-lucide="arrow-down" class="w-3.5 h-3.5"></i> Wajah DI BAWAH</button>
      <button @click="setFaceLayerOrder('above')" class="px-2 py-2 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all min-h-[36px]" :class="currentFaceLayerOrder === 'above' ? 'bg-purple-600 border-purple-400 text-white shadow' : 'bg-slate-950 border-slate-800 text-slate-300'"><i data-lucide="arrow-up" class="w-3.5 h-3.5"></i> Wajah DI ATAS</button>
    </div>
  </div>
</div>
`;
