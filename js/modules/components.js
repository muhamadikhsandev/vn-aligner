/**
 * js/modules/components.js
 * Imports HTML template strings and injects them into DOM mount points.
 */

import { headerHTML } from '../templates/header.js';
import { previewHTML } from '../templates/preview.js';
import { panelHTML }   from '../templates/panel.js';

export function injectComponents() {
  const headerMount = document.getElementById('app-header');
  if (headerMount) headerMount.outerHTML = headerHTML;

  const previewMount = document.getElementById('app-preview');
  if (previewMount) previewMount.outerHTML = previewHTML;

  const panelMount = document.getElementById('app-panel');
  if (panelMount) panelMount.outerHTML = panelHTML;
}
