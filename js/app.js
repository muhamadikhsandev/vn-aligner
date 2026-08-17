import Alpine from 'https://unpkg.com/alpinejs@3.x.x/dist/module.esm.js';
import { injectComponents } from './modules/components.js';
import { drawCanvas } from './modules/renderer.js';
import { downloadActiveItem, downloadBatchZip } from './modules/exporter.js';

import { createAppState } from './modules/appState.js';
import { transformActions } from './modules/transformActions.js';
import { templateContourActions } from './modules/templateContour.js';
import { assetManagerActions } from './modules/assetManager.js';
import { historyActions } from './modules/historyState.js';
import { pointerEventsActions } from './modules/pointerEvents.js';

export function refreshLucideIcons() {
  const run = () => {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  };
  run();
  setTimeout(run, 30);
  setTimeout(run, 150);
}

if (typeof window !== 'undefined' && typeof MutationObserver !== 'undefined') {
  let timer = null;
  const observer = new MutationObserver(() => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(refreshLucideIcons, 20);
  });
  document.addEventListener('DOMContentLoaded', () => {
    observer.observe(document.body, { childList: true, subtree: true });
  });
}

function initAlignerApp() {
  Alpine.data('alignerApp', () => {
    const appObj = {
      ...createAppState(),
      ...assetManagerActions,
      ...templateContourActions,
      ...pointerEventsActions,

      init() {
        this.initGestureHandler();
        this.pushHistoryState();

        this.$nextTick(() => {
          refreshLucideIcons();
        });

        this.$watch('activeTab', () => {
          this.$nextTick(() => {
            refreshLucideIcons();
          });
        });
        
        window.addEventListener('mousemove', (e) => this.handlePointerMove(e));
        window.addEventListener('touchmove', (e) => this.handlePointerMove(e), { passive: false });
        window.addEventListener('mouseup', () => this.handlePointerUp());
        window.addEventListener('touchend', (e) => this.handleTouchEnd(e));

        window.addEventListener('keydown', (e) => {
          const key = e.key ? e.key.toLowerCase() : '';
          if ((e.ctrlKey || e.metaKey) && key === 'z') {
            if (e.shiftKey) { 
              e.preventDefault(); 
              this.redo(); 
            } else { 
              e.preventDefault(); 
              this.undo(); 
            }
          } else if ((e.ctrlKey || e.metaKey) && key === 'y') {
            e.preventDefault(); 
            this.redo();
          }
        });
      },

      renderPreview() {
        if (this.renderPending) return;
        this.renderPending = true;
        requestAnimationFrame(() => {
          const canvas = document.getElementById('previewCanvas');
          drawCanvas(canvas, this);
          this.renderPending = false;
        });
      },

      downloadActive() {
        downloadActiveItem(this);
      },

      async downloadBatch() {
        this.stopAutoPlayFace(); 
        this.stopAutoPlayBody();
        await downloadBatchZip(this, (val) => { this.isZipping = val; });
      }
    };

    Object.defineProperties(appObj, Object.getOwnPropertyDescriptors(transformActions));
    Object.defineProperties(appObj, Object.getOwnPropertyDescriptors(historyActions));

    return appObj;
  });
}

injectComponents();
initAlignerApp();
window.Alpine = Alpine;
Alpine.start();

// Desktop Mouse Wheel & Mouse Drag-to-Scroll Helper for Tabs & Carousels
if (typeof window !== 'undefined') {
  window.addEventListener('wheel', (e) => {
    const el = e.target.closest('.overflow-x-auto, .no-scrollbar');
    if (el && el.scrollWidth > el.clientWidth) {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        el.scrollLeft += e.deltaY * 0.85;
        if (e.cancelable) e.preventDefault();
      }
    }
  }, { passive: false });

  let isDraggingScroll = false;
  let startX = 0;
  let initialScrollLeft = 0;
  let targetContainer = null;

  window.addEventListener('mousedown', (e) => {
    const el = e.target.closest('.overflow-x-auto, .no-scrollbar');
    if (el && el.scrollWidth > el.clientWidth && !e.target.closest('input, select, label')) {
      isDraggingScroll = true;
      targetContainer = el;
      startX = e.pageX;
      initialScrollLeft = el.scrollLeft;
    }
  });

  window.addEventListener('mouseup', () => {
    isDraggingScroll = false;
    targetContainer = null;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDraggingScroll || !targetContainer) return;
    const dx = e.pageX - startX;
    if (Math.abs(dx) > 3) {
      targetContainer.scrollLeft = initialScrollLeft - dx;
    }
  });
}

document.addEventListener('DOMContentLoaded', refreshLucideIcons);
window.addEventListener('load', refreshLucideIcons);
