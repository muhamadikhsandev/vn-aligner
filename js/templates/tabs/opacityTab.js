export const opacityTabHTML = `
<!-- TAB: OPACITY -->
<div x-show="activeTab === 'opacity'" class="flex flex-col gap-1.5">
  <div class="bg-slate-950/60 p-2 rounded-xl border border-slate-800 flex flex-col gap-1.5">
    <div class="flex justify-between items-center text-xs"><span class="text-slate-300">Alpha Wajah:</span><span class="font-mono text-emerald-400 font-bold" x-text="Math.round(currentFaceTransform.faceOpacity * 100) + '%'"></span></div>
    <input type="range" min="0" max="100" :value="Math.round(currentFaceTransform.faceOpacity * 100)" @input="updateFaceTransform('faceOpacity', $event.target.value / 100)" @change="pushHistoryState()" class="w-full accent-emerald-600 bg-slate-800 h-1.5 rounded cursor-pointer">
  </div>
  <div class="bg-slate-950/60 p-2 rounded-xl border border-slate-800 flex flex-col gap-1.5">
    <div class="flex justify-between items-center text-xs"><span class="text-slate-300">Alpha Badan (Onion):</span><span class="font-mono text-blue-400 font-bold" x-text="Math.round(currentBodyTransform.onionOpacity * 100) + '%'"></span></div>
    <input type="range" min="0" max="100" :value="Math.round(currentBodyTransform.onionOpacity * 100)" @input="updateBodyTransform('onionOpacity', $event.target.value / 100)" @change="pushHistoryState()" class="w-full accent-blue-600 bg-slate-800 h-1.5 rounded cursor-pointer">
  </div>
</div>
`;
