export const ratioTabHTML = `
<!-- TAB: RATIO -->
<div x-show="activeTab === 'ratio'" class="flex flex-col gap-1.5">
  <div class="bg-slate-950/60 p-2 rounded-xl border border-slate-800 flex flex-col gap-1.5">
    <div class="flex items-center gap-1.5"><i data-lucide="proportions" class="w-3.5 h-3.5 text-blue-400"></i><span class="text-xs font-semibold text-slate-200">Preset Rasio Canvas</span></div>
    <div class="grid grid-cols-3 gap-1">
      <template x-for="preset in ratioPresets" :key="preset.name">
        <button @click="applyRatioPreset(preset.w, preset.h)" class="px-1.5 py-1.5 rounded-lg bg-slate-900 border text-[10px] font-semibold flex flex-col items-center cursor-pointer min-h-[36px] justify-center" :class="(CANVAS_W === preset.w && CANVAS_H === preset.h) ? 'border-blue-500 bg-blue-950/50 text-blue-300' : 'border-slate-800 text-slate-300'">
          <span x-text="preset.name"></span>
        </button>
      </template>
    </div>
  </div>
</div>
`;
