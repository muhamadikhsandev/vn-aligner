export const bgTabHTML = `
<!-- TAB: BG -->
<div x-show="activeTab === 'bg'" class="flex flex-col gap-1.5">
  <div class="bg-amber-950/30 p-2 rounded-xl border border-amber-800/50 flex flex-col gap-1.5">
    <span class="text-xs font-bold text-amber-300 flex items-center gap-1.5"><i data-lucide="image" class="w-3.5 h-3.5 text-amber-400"></i> Background Canvas</span>
    <div class="grid grid-cols-3 gap-1">
      <button @click="bgType = 'transparent'; renderPreview()" class="px-2 py-1.5 rounded-lg border text-[10px] font-semibold flex flex-col items-center justify-center min-h-[34px]" :class="bgType === 'transparent' ? 'border-amber-500 bg-amber-950/50 text-amber-300' : 'border-slate-800 bg-slate-900 text-slate-300'">Transparan</button>
      <button @click="bgType = 'color'; renderPreview()" class="px-2 py-1.5 rounded-lg border text-[10px] font-semibold flex flex-col items-center justify-center min-h-[34px]" :class="bgType === 'color' ? 'border-amber-500 bg-amber-950/50 text-amber-300' : 'border-slate-800 bg-slate-900 text-slate-300'">Warna Custom</button>
      <button @click="bgType = 'image'; renderPreview()" class="px-2 py-1.5 rounded-lg border text-[10px] font-semibold flex flex-col items-center justify-center min-h-[34px]" :class="bgType === 'image' ? 'border-amber-500 bg-amber-950/50 text-amber-300' : 'border-slate-800 bg-slate-900 text-slate-300'">Gambar BG</button>
    </div>
    
    <!-- COLOR SELECTION SECTION -->
    <div x-show="bgType === 'color'" class="flex flex-col gap-1.5 bg-slate-950/80 p-2 rounded-lg border border-slate-800/80 mt-1">
      <div class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 rounded-lg border border-slate-700 shadow-inner flex-shrink-0" :style="{ backgroundColor: bgColor }"></div>
          <span class="font-mono text-xs font-bold text-amber-400" x-text="bgColor.toUpperCase()"></span>
        </div>
        <div class="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-md px-2 py-0.5">
          <span class="text-[10px] text-slate-500 font-mono">HEX</span>
          <input type="text" :value="bgColor" @input="updateBgHex($event.target.value)" class="w-14 bg-transparent text-xs font-mono text-amber-300 focus:outline-none uppercase text-center" maxlength="7">
        </div>
      </div>
      <div class="flex flex-col gap-1 pt-1 border-t border-slate-800/80">
        <div class="grid grid-cols-7 gap-1">
          <template x-for="hex in presetBgColors" :key="hex">
            <div @click="setBgColor(hex)" class="w-full aspect-square rounded-md border cursor-pointer transition-transform hover:scale-110" :style="{ backgroundColor: hex }" :class="bgColor.toLowerCase() === hex.toLowerCase() ? 'border-amber-400 ring-1 ring-amber-400/50 scale-105' : 'border-slate-800 opacity-80'"></div>
          </template>
        </div>
      </div>
    </div>

    <!-- BACKGROUND IMAGE UPLOAD SECTION -->
    <div x-show="bgType === 'image'" class="flex flex-col gap-1.5 bg-slate-950/80 p-2 rounded-lg border border-slate-800/80 mt-1">
      <span class="text-[10px] font-semibold text-amber-300 flex items-center gap-1"><i data-lucide="upload" class="w-3 h-3 text-amber-400"></i> Upload Foto Background:</span>
      <label class="w-full flex items-center justify-center border border-dashed border-amber-700/60 hover:border-amber-500 bg-slate-900 transition-all rounded-lg py-2 px-3 cursor-pointer text-center min-h-[36px]">
        <input type="file" @change="handleBgImageUpload($event)" accept="image/*" class="hidden" />
        <span class="text-[10px] font-medium text-amber-200 truncate" x-text="bgFileName"></span>
      </label>
    </div>

  </div>
</div>
`;
