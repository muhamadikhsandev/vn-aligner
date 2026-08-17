export const posFaceTabHTML = `
<!-- TAB: POSISI WAJAH -->
<div x-show="activeTab === 'posFace'" class="flex flex-col gap-1.5">
  <div x-show="faceAssetList.length > 0" class="flex items-center gap-1 overflow-x-auto pb-1 px-0.5 no-scrollbar touch-pan-x">
    <template x-for="(item, index) in faceAssetList" :key="item.id">
      <div @click="selectFace(index)" class="relative flex-shrink-0 border cursor-pointer rounded-md overflow-hidden bg-slate-950" :class="index === activeFaceIndex ? 'border-emerald-500 ring-2 ring-emerald-500/50' : 'border-slate-800 opacity-60'">
        <img :src="item.thumb" class="w-7 h-7 object-cover" />
      </div>
    </template>
  </div>

  <div class="flex items-center justify-between">
    <span class="text-xs font-bold text-emerald-400 flex items-center gap-1"><i data-lucide="smile" class="w-3.5 h-3.5"></i> Transform Wajah</span>
    <div class="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800">
      <button @click="setFaceMode('global')" class="px-2 py-0.5 text-[9px] font-bold rounded min-h-[24px]" :class="faceMode === 'global' ? 'bg-emerald-600 text-white' : 'text-slate-400'">Semua</button>
      <button @click="setFaceMode('individual')" class="px-2 py-0.5 text-[9px] font-bold rounded min-h-[24px]" :class="faceMode === 'individual' ? 'bg-emerald-600 text-white' : 'text-slate-400'">Satuan</button>
    </div>
  </div>
  <div class="bg-slate-950/60 p-1.5 rounded-lg border border-slate-800 flex flex-col gap-1">
    <div class="flex justify-between items-center text-xs"><span class="text-slate-300 font-medium">Skala Utama:</span><input type="number" min="1" max="5000" :value="currentFaceTransform.scale" @input="updateFaceTransform('scale', $event.target.value); pushHistoryState()" class="w-14 bg-slate-900 border border-slate-800 rounded text-center text-emerald-400 text-xs py-0.5 font-bold min-h-[28px]"></div>
    <input type="range" min="1" max="1000" :value="currentFaceTransform.scale" @input="updateFaceTransform('scale', $event.target.value)" @change="pushHistoryState()" class="w-full accent-emerald-600 bg-slate-800 h-1.5 rounded cursor-pointer">
  </div>
  <div class="grid grid-cols-2 gap-1.5">
    <div class="bg-slate-950/60 p-1.5 rounded-lg border border-slate-800 flex flex-col gap-1">
      <div class="flex justify-between items-center text-[10px]"><span class="text-slate-300 truncate">Lebar:</span><span class="font-mono text-emerald-400 font-bold" x-text="(currentFaceTransform.stretchX || 100) + '%'"></span></div>
      <input type="range" min="1" max="1000" :value="currentFaceTransform.stretchX || 100" @input="updateFaceTransform('stretchX', $event.target.value)" @change="pushHistoryState()" class="w-full accent-emerald-600 bg-slate-800 h-1.5 rounded cursor-pointer">
    </div>
    <div class="bg-slate-950/60 p-1.5 rounded-lg border border-slate-800 flex flex-col gap-1">
      <div class="flex justify-between items-center text-[10px]"><span class="text-slate-300 truncate">Tinggi:</span><span class="font-mono text-emerald-400 font-bold" x-text="(currentFaceTransform.stretchY || 100) + '%'"></span></div>
      <input type="range" min="1" max="1000" :value="currentFaceTransform.stretchY || 100" @input="updateFaceTransform('stretchY', $event.target.value)" @change="pushHistoryState()" class="w-full accent-emerald-600 bg-slate-800 h-1.5 rounded cursor-pointer">
    </div>
  </div>
  <div class="grid grid-cols-2 gap-1.5">
    <div class="bg-slate-950/60 p-1.5 rounded-lg border border-slate-800 flex flex-col gap-1">
      <span class="text-[10px] text-slate-300">Pos X:</span>
      <input type="range" min="-3000" max="3000" :value="currentFaceTransform.offsetX" @input="updateFaceTransform('offsetX', $event.target.value)" @change="pushHistoryState()" class="w-full accent-emerald-600 bg-slate-800 h-1.5 rounded cursor-pointer">
    </div>
    <div class="bg-slate-950/60 p-1.5 rounded-lg border border-slate-800 flex flex-col gap-1">
      <span class="text-[10px] text-slate-300">Pos Y:</span>
      <input type="range" min="-3000" max="3000" :value="currentFaceTransform.offsetY" @input="updateFaceTransform('offsetY', $event.target.value)" @change="pushHistoryState()" class="w-full accent-emerald-600 bg-slate-800 h-1.5 rounded cursor-pointer">
    </div>
  </div>
</div>
`;
