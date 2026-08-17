export const exportTabHTML = `
<!-- TAB: EXPORT -->
<div x-show="activeTab === 'export'" class="flex flex-col gap-1.5">
  <div class="relative" @click.outside="isExportDropdownOpen = false">
    <label class="block text-[10px] font-medium text-slate-300 mb-0.5">Mode Hasil Layer</label>
    <button @click="isExportDropdownOpen = !isExportDropdownOpen" type="button" class="w-full bg-slate-950 border border-slate-700/80 text-slate-100 text-xs font-medium rounded-lg p-2 flex items-center justify-between min-h-[36px]">
      <span class="truncate" x-text="exportOptions.find(o => o.value === exportMode)?.label"></span>
      <i data-lucide="chevron-down" class="w-3.5 h-3.5 text-slate-400"></i>
    </button>
    <div x-show="isExportDropdownOpen" class="absolute z-50 w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg shadow-xl py-1">
      <template x-for="option in exportOptions" :key="option.value">
        <div @click="exportMode = option.value; isExportDropdownOpen = false" class="px-3 py-1.5 text-xs cursor-pointer flex items-center justify-between hover:bg-slate-800" :class="exportMode === option.value ? 'bg-blue-600/30 text-blue-300 font-bold' : 'text-slate-200'">
          <span x-text="option.label"></span>
        </div>
      </template>
    </div>
  </div>
  <div class="relative" @click.outside="isScopeDropdownOpen = false">
    <label class="block text-[10px] font-medium text-slate-300 mb-0.5">Target Unduh</label>
    <button @click="isScopeDropdownOpen = !isScopeDropdownOpen" type="button" class="w-full bg-slate-950 border border-slate-700/80 text-slate-100 text-xs font-medium rounded-lg p-2 flex items-center justify-between min-h-[36px]">
      <span class="truncate" x-text="exportScopeOptions.find(o => o.value === exportScope)?.label"></span>
      <i data-lucide="chevron-down" class="w-3.5 h-3.5 text-slate-400"></i>
    </button>
    <div x-show="isScopeDropdownOpen" class="absolute z-50 w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg shadow-xl py-1">
      <template x-for="option in exportScopeOptions" :key="option.value">
        <div @click="exportScope = option.value; isScopeDropdownOpen = false" class="px-3 py-1.5 text-xs cursor-pointer flex items-center justify-between hover:bg-slate-800" :class="exportScope === option.value ? 'bg-emerald-600/30 text-emerald-300 font-bold' : 'text-slate-200'">
          <span x-text="option.label"></span>
        </div>
      </template>
    </div>
  </div>
  <div class="pt-0.5">
    <button x-show="exportScope === 'single'" @click="downloadActive()" :disabled="!isReady" class="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-bold py-2 px-3 rounded-lg transition-all text-xs cursor-pointer disabled:cursor-not-allowed min-h-[38px]">
      <i data-lucide="download" class="w-3.5 h-3.5"></i><span>Unduh Transparan</span>
    </button>
    <button x-show="exportScope !== 'single'" @click="downloadBatch()" :disabled="!isReady || isZipping" class="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white font-bold py-2 px-3 rounded-lg transition-all text-xs cursor-pointer disabled:cursor-not-allowed min-h-[38px]">
      <i x-show="!isZipping" data-lucide="file-archive" class="w-3.5 h-3.5"></i>
      <i x-show="isZipping" data-lucide="loader-2" class="w-3.5 h-3.5 animate-spin-fast"></i>
      <span x-text="isZipping ? 'Memproses...' : 'Unduh ZIP'"></span>
    </button>
  </div>
</div>
`;
