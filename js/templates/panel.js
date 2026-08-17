// js/templates/panel.js
// Modularized Control Panel shell

import { uploadTabHTML }    from './tabs/uploadTab.js';
import { boxTabHTML }       from './tabs/boxTab.js';
import { posFaceTabHTML }   from './tabs/posFaceTab.js';
import { shapeFaceTabHTML } from './tabs/shapeFaceTab.js';
import { rotateTabHTML }    from './tabs/rotateTab.js';
import { posBodyTabHTML }   from './tabs/posBodyTab.js';
import { layerTabHTML }     from './tabs/layerTab.js';
import { bgTabHTML }        from './tabs/bgTab.js';
import { ratioTabHTML }     from './tabs/ratioTab.js';
import { opacityTabHTML }   from './tabs/opacityTab.js';
import { deleteTabHTML }    from './tabs/deleteTab.js';
import { exportTabHTML }    from './tabs/exportTab.js';

export const panelHTML = `
<div class="lg:col-span-4 flex flex-col bg-slate-900/90 border border-slate-800 rounded-xl p-1.5 shadow-xl shrink-0 transition-all duration-200 overflow-hidden"
     :class="isPanelCollapsed ? 'h-auto' : 'max-h-[300px] sm:max-h-[360px] lg:max-h-full'">

  <!-- PANEL HEADER & COLLAPSE TOGGLE -->
  <div class="flex items-center justify-between px-1.5 py-1 mb-1 border-b border-slate-800/80 shrink-0">
    <div class="flex items-center gap-1.5">
      <span class="text-xs font-bold text-slate-200 flex items-center gap-1">
        <i data-lucide="sliders" class="w-3.5 h-3.5 text-blue-400"></i> Pengaturan &amp; Aset
      </span>
      <span class="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono uppercase" x-text="activeTab"></span>
    </div>
    
    <!-- MINIMIZE / EXPAND TOGGLE BUTTON -->
    <button @click="isPanelCollapsed = !isPanelCollapsed; $nextTick(() => refreshLucideIcons())"
            class="px-2 py-0.5 rounded text-[10px] font-bold border transition-all cursor-pointer flex items-center gap-1"
            :class="isPanelCollapsed ? 'bg-blue-600 text-white border-blue-400 shadow' : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'">
      <i x-show="!isPanelCollapsed" data-lucide="chevron-down" class="w-3.5 h-3.5"></i>
      <i x-show="isPanelCollapsed" data-lucide="chevron-up" class="w-3.5 h-3.5"></i>
      <span x-text="isPanelCollapsed ? 'Buka Panel' : 'Kecilkan'"></span>
    </button>
  </div>

  <!-- NAV TAB BUTTONS (GESTURE SCROLLABLE HORIZONTAL BAR) -->
  <div class="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800/80 mb-1 shrink-0 overflow-x-auto no-scrollbar touch-pan-x cursor-grab">
    <button @click="activeTab = 'upload'; isPanelCollapsed = false" class="px-2.5 py-1 rounded text-[9px] font-semibold transition-all cursor-pointer flex items-center gap-1 shrink-0 min-h-[30px]" :class="activeTab === 'upload' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'"><i data-lucide="folder-open" class="w-3.5 h-3.5"></i> Up &amp; Aset</button>
    <button @click="setModeTransform(); isPanelCollapsed = false" class="px-2.5 py-1 rounded text-[9px] font-semibold transition-all cursor-pointer flex items-center gap-1 shrink-0 min-h-[30px]" :class="activeTab === 'box' ? 'bg-cyan-600 text-white shadow ring-1 ring-cyan-400' : 'text-slate-400 hover:text-white'"><i data-lucide="box" class="w-3.5 h-3.5 text-cyan-300"></i> Mode Box</button>
    <button @click="setModeDrag(); activeTarget = 'face'; isPanelCollapsed = false" class="px-2.5 py-1 rounded text-[9px] font-semibold transition-all cursor-pointer flex items-center gap-1 shrink-0 min-h-[30px]" :class="activeTab === 'posFace' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'"><i data-lucide="smile" class="w-3.5 h-3.5"></i> Face</button>
    <button @click="setModeShape(); isPanelCollapsed = false" class="px-2.5 py-1 rounded text-[9px] font-semibold transition-all cursor-pointer flex items-center gap-1 shrink-0 min-h-[30px]" :class="activeTab === 'shapeFace' ? 'bg-pink-600 text-white shadow ring-1 ring-pink-400' : 'text-slate-400 hover:text-white'"><i data-lucide="sparkles" class="w-3.5 h-3.5 text-pink-300"></i> Bentuk</button>
    <button @click="activeTab = 'rotate'; isPanelCollapsed = false" class="px-2.5 py-1 rounded text-[9px] font-semibold transition-all cursor-pointer flex items-center gap-1 shrink-0 min-h-[30px]" :class="activeTab === 'rotate' ? 'bg-indigo-600 text-white shadow ring-1 ring-indigo-400' : 'text-slate-400 hover:text-white'"><i data-lucide="rotate-cw" class="w-3.5 h-3.5 text-indigo-300"></i> Rotasi</button>
    <button @click="activeTab = 'posBody'; activeTarget = 'body'; isPanelCollapsed = false" class="px-2.5 py-1 rounded text-[9px] font-semibold transition-all cursor-pointer flex items-center gap-1 shrink-0 min-h-[30px]" :class="activeTab === 'posBody' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'"><i data-lucide="user" class="w-3.5 h-3.5"></i> Body</button>
    <button @click="activeTab = 'layer'; isPanelCollapsed = false" class="px-2.5 py-1 rounded text-[9px] font-semibold transition-all cursor-pointer flex items-center gap-1 shrink-0 min-h-[30px]" :class="activeTab === 'layer' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'"><i data-lucide="layers" class="w-3.5 h-3.5"></i> Layer</button>
    <button @click="activeTab = 'bg'; isPanelCollapsed = false" class="px-2.5 py-1 rounded text-[9px] font-semibold transition-all cursor-pointer flex items-center gap-1 shrink-0 min-h-[30px]" :class="activeTab === 'bg' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'"><i data-lucide="image" class="w-3.5 h-3.5"></i> BG</button>
    <button @click="activeTab = 'ratio'; isPanelCollapsed = false" class="px-2.5 py-1 rounded text-[9px] font-semibold transition-all cursor-pointer flex items-center gap-1 shrink-0 min-h-[30px]" :class="activeTab === 'ratio' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'"><i data-lucide="proportions" class="w-3.5 h-3.5"></i> Size</button>
    <button @click="activeTab = 'opacity'; isPanelCollapsed = false" class="px-2.5 py-1 rounded text-[9px] font-semibold transition-all cursor-pointer flex items-center gap-1 shrink-0 min-h-[30px]" :class="activeTab === 'opacity' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'"><i data-lucide="eye" class="w-3.5 h-3.5"></i> Alpha</button>
    <button @click="activeTab = 'delete'; isPanelCollapsed = false" class="px-2.5 py-1 rounded text-[9px] font-semibold transition-all cursor-pointer flex items-center gap-1 shrink-0 min-h-[30px]" :class="activeTab === 'delete' ? 'bg-rose-600 text-white shadow ring-1 ring-rose-400' : 'text-slate-400 hover:text-white'"><i data-lucide="trash-2" class="w-3.5 h-3.5 text-rose-300"></i> Hapus</button>
    <button @click="activeTab = 'export'; isPanelCollapsed = false" class="px-2.5 py-1 rounded text-[9px] font-semibold transition-all cursor-pointer flex items-center gap-1 shrink-0 min-h-[30px]" :class="activeTab === 'export' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'"><i data-lucide="download" class="w-3.5 h-3.5"></i> Save</button>
  </div>

  <!-- TAB CONTENTS CONTAINER -->
  <div x-show="!isPanelCollapsed" class="flex-1 overflow-y-auto no-scrollbar p-0.5 space-y-2 max-h-[190px] sm:max-h-[250px] lg:max-h-full">
    ${uploadTabHTML}
    ${boxTabHTML}
    ${posFaceTabHTML}
    ${shapeFaceTabHTML}
    ${rotateTabHTML}
    ${posBodyTabHTML}
    ${layerTabHTML}
    ${bgTabHTML}
    ${ratioTabHTML}
    ${opacityTabHTML}
    ${deleteTabHTML}
    ${exportTabHTML}
  </div>
</div>
`;
