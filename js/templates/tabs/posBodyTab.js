export const posBodyTabHTML = `
<!-- TAB: POSISI BADAN -->
<div x-show="activeTab === 'posBody'" class="flex flex-col gap-1.5">
  <div x-show="bodyAssetList.length > 0" class="flex items-center gap-1 overflow-x-auto pb-1 px-0.5 no-scrollbar touch-pan-x">
    <template x-for="(item, index) in bodyAssetList" :key="item.id">
      <div @click="selectBody(index)" class="relative flex-shrink-0 border cursor-pointer rounded-md overflow-hidden bg-slate-950" :class="index === activeBodyIndex ? 'border-blue-400 ring-2 ring-blue-500/50' : 'border-slate-800 opacity-60'">
        <img :src="item.thumb" class="w-7 h-7 object-cover" />
      </div>
    </template>
  </div>

  <div class="flex items-center justify-between">
    <span class="text-xs font-bold text-blue-400">Transform Badan</span>
    <div class="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800">
      <button @click="setBodyMode('global')" class="px-2 py-0.5 text-[9px] font-bold rounded min-h-[24px]" :class="bodyMode === 'global' ? 'bg-blue-600 text-white' : 'text-slate-400'">Semua</button>
      <button @click="setBodyMode('individual')" class="px-2 py-0.5 text-[9px] font-bold rounded min-h-[24px]" :class="bodyMode === 'individual' ? 'bg-blue-600 text-white' : 'text-slate-400'">Satuan</button>
    </div>
  </div>
  <button @click="fitBodyToCanvas()" class="w-full py-1.5 bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 border border-blue-500/50 rounded-lg text-xs font-bold cursor-pointer transition-all min-h-[34px]">Fit Full Canvas Ratio</button>
  <div class="bg-slate-950/60 p-1.5 rounded-lg border border-slate-800 flex flex-col gap-1">
    <div class="flex justify-between items-center text-xs"><span class="text-slate-300">Skala Badan:</span><input type="number" min="1" max="5000" :value="currentBodyTransform.scale" @input="updateBodyTransform('scale', \$event.target.value); pushHistoryState()" class="w-14 bg-slate-900 border border-slate-800 rounded text-center text-blue-400 text-xs py-0.5 font-bold min-h-[28px]"></div>
    <input type="range" min="1" max="1000" :value="currentBodyTransform.scale" @input="updateBodyTransform('scale', \$event.target.value)" @change="pushHistoryState()" class="w-full accent-blue-600 bg-slate-800 h-1.5 rounded cursor-pointer">
  </div>
</div>
`;
