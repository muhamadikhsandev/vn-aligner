import { TouchGestureHandler } from './gestures.js';
import { FaceRegistry } from './registry.js';
import { getFaceDimensions, getBodyDimensions } from './transform.js';
import { getHandlePositions } from './renderer.js';
import { refreshLucideIcons } from '../app.js';

export const pointerEventsActions = {
  initGestureHandler() {
    this.gestureHandler = new TouchGestureHandler({
      onScaleChange: (newScale) => {
        if (this.isLocked) return;
        if (this.activeTarget === 'face') {
          this.updateFaceTransform('scale', newScale);
        } else {
          this.updateBodyTransform('scale', newScale);
        }
      },
      onMoveChange: (newX, newY) => {
        if (this.isLocked) return;
        if (this.activeTarget === 'face') {
          this.updateFaceTransform('offsetX', Math.round(newX));
          this.updateFaceTransform('offsetY', Math.round(newY));
        } else {
          this.updateBodyTransform('offsetX', Math.round(newX));
          this.updateBodyTransform('offsetY', Math.round(newY));
        }
      },
      onGestureStart: () => {
        this.isDragging = false;
        this.pushHistoryState();
      },
      onGestureEnd: () => {
        this.pushHistoryState();
        this.renderPreview();
      }
    });
  },

  toggleEraserBrush() {
    this.isEraserActive = !this.isEraserActive;
    if (this.isEraserActive) {
      this.activeTab = 'delete';
    }
    this.renderPreview();
  },

  clearEraseStrokes() {
    if (this.isLocked) return;
    this.pushHistoryState();
    const targetTrans = this.currentTransform;
    targetTrans.eraseStrokes = [];
    this.renderPreview();
  },

  panCamera(dx, dy) { 
    this.camPanX += dx; 
    this.camPanY += dy; 
  },

  resetCameraPan() { 
    this.camPanX = 0; 
    this.camPanY = 0; 
  },

  setCameraPreset(zoomVal) {
    this.camZoom = zoomVal;
    this.camZoomPercent = Math.round(zoomVal * 100);
    if (zoomVal === 1.0) { 
      this.camPanX = 0; 
      this.camPanY = 0; 
    }
  },

  applyRatioPreset(w, h) {
    this.CANVAS_W = w; 
    this.CANVAS_H = h;
    this.tempW = w; 
    this.tempH = h;
    this.pushHistoryState();
    this.renderPreview();
  },

  updateCanvasDimensions() {
    this.CANVAS_W = Math.max(10, Math.min(10000, parseInt(this.tempW) || 600));
    this.CANVAS_H = Math.max(10, Math.min(10000, parseInt(this.tempH) || 800));
    this.pushHistoryState();
    this.renderPreview();
  },

  toggleLock() {
    this.isLocked = !this.isLocked;
    if (!this.isLocked) this.isSelected = true;
    this.$nextTick(() => { refreshLucideIcons(); });
    this.renderPreview();
  },

  getCanvasCoords(e) {
    const canvas = document.getElementById('previewCanvas');
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (this.CANVAS_W / rect.width),
      y: (clientY - rect.top) * (this.CANVAS_H / rect.height)
    };
  },

  getCurrentFaceRect() {
    if (this.faceAssetList.length === 0 || !this.faceAssetList[this.activeFaceIndex]) return null;
    const faceData = FaceRegistry.get(this.faceAssetList[this.activeFaceIndex].id);
    if (!faceData || !faceData.img) return null;
    const trans = this.currentFaceTransform;
    const dim = getFaceDimensions(faceData.img, trans, this.CANVAS_W, this.CANVAS_H);
    return { 
      x: Math.round(((this.CANVAS_W - dim.w) / 2) + trans.offsetX), 
      y: Math.round(((this.CANVAS_H - dim.h) / 2) + trans.offsetY), 
      w: Math.round(dim.w), 
      h: Math.round(dim.h) 
    };
  },

  getCurrentBodyRect() {
    if (this.bodyAssetList.length === 0 || !this.bodyAssetList[this.activeBodyIndex]) return null;
    const refData = FaceRegistry.get(this.bodyAssetList[this.activeBodyIndex].id);
    if (!refData || !refData.img) return null;
    const trans = this.currentBodyTransform;
    const dim = getBodyDimensions(refData.img, trans, this.CANVAS_W, this.CANVAS_H);
    return { 
      x: Math.round(((this.CANVAS_W - dim.w) / 2) + trans.offsetX), 
      y: Math.round(((this.CANVAS_H - dim.h) / 2) + trans.offsetY + trans.topPadding), 
      w: Math.round(dim.w), 
      h: Math.round(dim.h) 
    };
  },

  checkHandleHit(pos, rect) {
    if (!rect) return null;
    const handles = getHandlePositions(rect);
    const canvas = document.getElementById('previewCanvas');
    const rectClient = canvas ? canvas.getBoundingClientRect() : { width: this.CANVAS_W };
    const scaleRatio = this.CANVAS_W / (rectClient.width || this.CANVAS_W);

    const keys = ['nw', 'ne', 'sw', 'se', 'n', 's', 'w', 'e'];
    for (const key of keys) {
      const h = handles[key];
      const dist = Math.hypot(pos.x - h.x, pos.y - h.y);
      // Smooth hit radius for corner circle handles (perkecil/skala) and side circle handles (perlebar)
      const hitRadius = h.isCorner 
        ? Math.max(32, 32 * scaleRatio) 
        : Math.max(24, 24 * scaleRatio);
      if (dist <= hitRadius) {
        return h;
      }
    }
    return null;
  },

  handlePointerDown(e) {
    const isTargetFace = (this.activeTarget === 'face');
    const activeTrans = isTargetFace ? this.currentFaceTransform : this.currentBodyTransform;
    if (this.gestureHandler.handleTouchStart(e, activeTrans.scale, activeTrans.offsetX, activeTrans.offsetY)) {
      if (e.cancelable) e.preventDefault();
      return;
    }

    const pos = this.getCanvasCoords(e);
    this.activePointerPos = pos;

    if (this.isLocked) return;

    // MODE BRUSH HAPUS CANVAS
    if (this.isEraserActive) {
      const targetTrans = this.currentTransform;
      if (!targetTrans.eraseStrokes) targetTrans.eraseStrokes = [];
      targetTrans.eraseStrokes.push({
        x: Math.round(pos.x),
        y: Math.round(pos.y),
        size: this.brushSize,
        opacity: this.brushOpacity / 100,
        isContinuous: false
      });
      this.isDragging = true;
      this.dragMode = 'erase';
      this.renderPreview();
      return;
    }

    const faceRect = this.getCurrentFaceRect();
    const bodyRect = this.getCurrentBodyRect();

    // 0. CHECK BOX RESIZE HANDLES (MODE TRANSFORM OR MODE BENTUK)
    const isTransformOrShapeMode = (this.canvasInteractionMode === 'transform' || this.canvasInteractionMode === 'shape' || this.activeTab === 'box' || this.activeTab === 'shapeFace');

    if (isTransformOrShapeMode) {
      const activeRect = isTargetFace ? faceRect : bodyRect;
      const otherRect = isTargetFace ? bodyRect : faceRect;
      const otherTargetName = isTargetFace ? 'body' : 'face';

      let hitHandle = this.checkHandleHit(pos, activeRect);
      let hitTarget = hitHandle ? this.activeTarget : null;

      if (!hitHandle && otherRect) {
        hitHandle = this.checkHandleHit(pos, otherRect);
        if (hitHandle) {
          hitTarget = otherTargetName;
        }
      }

      if (hitHandle && hitTarget) {
        this.activeTarget = hitTarget;
        this.activeHandle = hitHandle.key;
        this.dragMode = 'resize_' + hitHandle.key;
        this.isDragging = true;
        this.dragStartX = pos.x;
        this.dragStartY = pos.y;

        const targetTrans = hitTarget === 'face' ? this.currentFaceTransform : this.currentBodyTransform;
        this.initialScale = targetTrans.scale;
        this.initialStretchX = targetTrans.stretchX !== undefined ? targetTrans.stretchX : (targetTrans.reshape?.stretchX || 100);
        this.initialStretchY = targetTrans.stretchY !== undefined ? targetTrans.stretchY : (targetTrans.reshape?.stretchY || 100);
        this.initialRect = hitTarget === 'face' ? faceRect : bodyRect;
        this.initialOffsetX = targetTrans.offsetX;
        this.initialOffsetY = targetTrans.offsetY;

        this.renderPreview();
        return;
      }
    }

    // 1. MODE BENTUK (FACE SHAPE WARP DEFORM) - EXCLUSIVE TO MODE BENTUK
    if (this.canvasInteractionMode === 'shape' && faceRect) {
      const u0 = (pos.x - faceRect.x) / faceRect.w;
      const v0 = (pos.y - faceRect.y) / faceRect.h;

      if (u0 >= -0.35 && u0 <= 1.35 && v0 >= -0.35 && v0 <= 1.35) {
        const trans = this.currentFaceTransform;
        if (!trans.reshape) trans.reshape = {};
        if (!Array.isArray(trans.reshape.templatePoints) || trans.reshape.templatePoints.length === 0) {
          trans.reshape.templatePoints = [
            { id: 0, u: 0.50, v: 0.05, label: 'Dahi Atas' },
            { id: 1, u: 0.72, v: 0.12, label: 'Pelipis Kanan' },
            { id: 2, u: 0.88, v: 0.28, label: 'Tulang Pipi Atas Kanan' },
            { id: 3, u: 0.95, v: 0.50, label: 'Pipi Kanan' },
            { id: 4, u: 0.85, v: 0.73, label: 'Rahang Kanan' },
            { id: 5, u: 0.65, v: 0.90, label: 'Sisi Dagu Kanan' },
            { id: 6, u: 0.50, v: 0.96, label: 'Ujung Dagu' },
            { id: 7, u: 0.35, v: 0.90, label: 'Sisi Dagu Kiri' },
            { id: 8, u: 0.15, v: 0.73, label: 'Rahang Kiri' },
            { id: 9, u: 0.05, v: 0.50, label: 'Pipi Kiri' },
            { id: 10, u: 0.12, v: 0.28, label: 'Tulang Pipi Atas Kiri' },
            { id: 11, u: 0.28, v: 0.12, label: 'Pelipis Kiri' }
          ];
        }
        trans.reshape.useTemplate = true;

        this.activeTarget = 'face';
        this.dragMode = 'pull_warp';
        this.isDragging = true;
        this.warpStartPos = { x: pos.x, y: pos.y };
        this.warpStartU = u0;
        this.warpStartV = v0;
        this.initialTemplatePoints = JSON.parse(JSON.stringify(trans.reshape.templatePoints));
        this.renderPreview();
        return;
      }
    }

    // 2. MODE DRAG (PURITY MOVE POSITION DRAGGING)
    if (this.lockImagePosition) return;

    // Check click target (face vs body) or drag active target
    if (faceRect && (pos.x >= faceRect.x - 20 && pos.x <= faceRect.x + faceRect.w + 20 && pos.y >= faceRect.y - 20 && pos.y <= faceRect.y + faceRect.h + 20)) {
      this.activeTarget = 'face'; 
      this.activeHandle = null;
      this.isDragging = true; 
      this.dragMode = 'move';
      this.dragStartX = pos.x; 
      this.dragStartY = pos.y;
      this.initialOffsetX = this.currentFaceTransform.offsetX;
      this.initialOffsetY = this.currentFaceTransform.offsetY;
      this.renderPreview(); 
      return;
    }

    if (bodyRect && (pos.x >= bodyRect.x - 20 && pos.x <= bodyRect.x + bodyRect.w + 20 && pos.y >= bodyRect.y - 20 && pos.y <= bodyRect.y + bodyRect.h + 20)) {
      this.activeTarget = 'body'; 
      this.activeHandle = null;
      this.isDragging = true; 
      this.dragMode = 'move';
      this.dragStartX = pos.x; 
      this.dragStartY = pos.y;
      this.initialOffsetX = this.currentBodyTransform.offsetX;
      this.initialOffsetY = this.currentBodyTransform.offsetY;
      this.renderPreview(); 
      return;
    }

    // Fallback: If clicked on canvas and we have active target, move active target
    if (this.isDragEnabled) {
      this.activeHandle = null;
      this.isDragging = true;
      this.dragMode = 'move';
      this.dragStartX = pos.x;
      this.dragStartY = pos.y;
      const targetTrans = isTargetFace ? this.currentFaceTransform : this.currentBodyTransform;
      this.initialOffsetX = targetTrans.offsetX;
      this.initialOffsetY = targetTrans.offsetY;
      this.renderPreview();
    }
  },

  handlePointerMove(e) {
    if (this.gestureHandler && this.gestureHandler.handleTouchMove(e, (ev) => this.getCanvasCoords(ev))) {
      if (e.cancelable) e.preventDefault();
      return;
    }

    const pos = this.getCanvasCoords(e);
    this.activePointerPos = pos;
    const canvas = document.getElementById('previewCanvas');

    // MODE BRUSH HAPUS DRAGGING / HOVER RING
    if (this.isEraserActive) {
      if (canvas) canvas.style.cursor = 'crosshair';
      if (this.isDragging && this.dragMode === 'erase') {
        const targetTrans = this.currentTransform;
        if (!targetTrans.eraseStrokes) targetTrans.eraseStrokes = [];
        targetTrans.eraseStrokes.push({
          x: Math.round(pos.x),
          y: Math.round(pos.y),
          size: this.brushSize,
          opacity: this.brushOpacity / 100,
          isContinuous: true
        });
      }
      this.renderPreview();
      return;
    }

    // Hover cursor check when not dragging
    if (!this.isDragging && !this.isLocked) {
      if (this.canvasInteractionMode === 'drag') {
        if (canvas) canvas.style.cursor = 'grab';
        if (this.activeHandle !== null) {
          this.activeHandle = null;
          this.renderPreview();
        }
        return;
      }

      const faceRect = this.getCurrentFaceRect();
      const bodyRect = this.getCurrentBodyRect();

      // Direct Pull Gesture Hover Cursor strictly in Mode Bentuk (canvasInteractionMode === 'shape')
      if (this.canvasInteractionMode === 'shape' && faceRect) {
        const u0 = (pos.x - faceRect.x) / faceRect.w;
        const v0 = (pos.y - faceRect.y) / faceRect.h;
        if (u0 >= -0.35 && u0 <= 1.35 && v0 >= -0.35 && v0 <= 1.35) {
          if (canvas) canvas.style.cursor = 'grab';
          return;
        }
      }

      const activeRect = (this.activeTarget === 'face') ? faceRect : bodyRect;
      const isTransformMode = (this.canvasInteractionMode === 'transform' || this.activeTab === 'box');
      const hit = isTransformMode ? (this.checkHandleHit(pos, activeRect) || this.checkHandleHit(pos, (this.activeTarget === 'face') ? bodyRect : faceRect)) : null;
      
      if (hit) {
        if (canvas) canvas.style.cursor = hit.cursor;
        if (this.activeHandle !== hit.key) {
          this.activeHandle = hit.key;
          this.renderPreview();
        }
      } else {
        if (canvas) canvas.style.cursor = '';
        if (this.activeHandle !== null) {
          this.activeHandle = null;
          this.renderPreview();
        }
      }
      return;
    }

    if (!this.isDragging || this.isLocked) return;

    // MODE GESTURE TARIK / PULL WARP DEFORMASI WAJAH (DESKTOP & MOBILE)
    if (this.dragMode === 'pull_warp') {
      const faceRect = this.getCurrentFaceRect();
      if (faceRect && this.initialTemplatePoints) {
        const totalDu = (pos.x - this.warpStartPos.x) / faceRect.w;
        const totalDv = (pos.y - this.warpStartPos.y) / faceRect.h;

        const reshape = this.currentFaceTransform.reshape;
        if (reshape && Array.isArray(reshape.templatePoints)) {
          const pullRadius = 0.38;
          reshape.templatePoints = this.initialTemplatePoints.map(initPt => {
            const dist = Math.hypot(initPt.u - this.warpStartU, initPt.v - this.warpStartV);
            let weight = 0;
            if (dist < pullRadius) {
              // Smooth Cosine falloff curve
              weight = Math.cos((dist / pullRadius) * (Math.PI / 2));
            }
            return {
              ...initPt,
              u: Math.max(-0.35, Math.min(1.35, initPt.u + totalDu * weight)),
              v: Math.max(-0.35, Math.min(1.35, initPt.v + totalDv * weight))
            };
          });
          reshape.useTemplate = true;
          this.renderPreview();
        }
      }
      return;
    }

    const dx = pos.x - this.dragStartX;
    const dy = pos.y - this.dragStartY;

    // MODE A: Interactive Handle Resizing
    if (this.dragMode.startsWith('resize_')) {
      const handleKey = this.dragMode.replace('resize_', '');
      const refDim = Math.max(20, (this.initialRect.w + this.initialRect.h) / 2);

      if (handleKey === 'se' || handleKey === 'nw' || handleKey === 'ne' || handleKey === 'sw') {
        let delta = 0;
        if (handleKey === 'se') delta = (dx + dy) / 2;
        else if (handleKey === 'nw') delta = (-dx - dy) / 2;
        else if (handleKey === 'ne') delta = (dx - dy) / 2;
        else if (handleKey === 'sw') delta = (-dx + dy) / 2;

        const pctChange = (delta / refDim) * 100;
        const newScale = Math.max(1, Math.min(5000, Math.round(this.initialScale + pctChange)));

        if (this.activeTarget === 'face') {
          this.updateFaceTransform('scale', newScale);
        } else {
          this.updateBodyTransform('scale', newScale);
        }
      } else if (handleKey === 'e' || handleKey === 'w') {
        const deltaX = (handleKey === 'e') ? dx : -dx;
        const pctChange = (deltaX / Math.max(1, this.initialRect.w)) * 100;
        const newStretchX = Math.max(1, Math.min(5000, Math.round(this.initialStretchX + pctChange)));

        if (this.activeTarget === 'face') {
          this.updateFaceTransform('stretchX', newStretchX);
        } else {
          this.updateBodyTransform('scale', Math.max(1, Math.min(5000, Math.round(this.initialScale + (deltaX / refDim) * 100))));
        }
      } else if (handleKey === 'n' || handleKey === 's') {
        const deltaY = (handleKey === 's') ? dy : -dy;
        const pctChange = (deltaY / Math.max(1, this.initialRect.h)) * 100;
        const newStretchY = Math.max(1, Math.min(5000, Math.round(this.initialStretchY + pctChange)));

        if (this.activeTarget === 'face') {
          this.updateFaceTransform('stretchY', newStretchY);
        } else {
          this.updateBodyTransform('scale', Math.max(1, Math.min(5000, Math.round(this.initialScale + (deltaY / refDim) * 100))));
        }
      }

      this.renderPreview();
      return;
    }

    // MODE B: Move Position Dragging (Pure Pan/Geser Posisi Aset)
    if (canvas) canvas.style.cursor = 'grabbing';
    let targetX = Math.round(this.initialOffsetX + dx);
    let targetY = Math.round(this.initialOffsetY + dy);

    // Magnetic Snapping ke Sumbu Center X (0px) & Y (0px)
    if (Math.abs(targetX) <= 8) {
      targetX = 0;
      this.isSnappedX = true;
    } else {
      this.isSnappedX = false;
    }

    if (Math.abs(targetY) <= 8) {
      targetY = 0;
      this.isSnappedY = true;
    } else {
      this.isSnappedY = false;
    }

    if (this.activeTarget === 'face') {
      this.updateFaceTransform('offsetX', targetX);
      this.updateFaceTransform('offsetY', targetY);
    } else {
      this.updateBodyTransform('offsetX', targetX);
      this.updateBodyTransform('offsetY', targetY);
    }
    this.renderPreview();
  },

  handlePointerUp() {
    if (this.isDragging) {
      this.isDragging = false;
      this.activeHandle = null;
      this.isSnappedX = false;
      this.isSnappedY = false;
      const canvas = document.getElementById('previewCanvas');
      if (canvas) canvas.style.cursor = (this.canvasInteractionMode === 'drag') ? 'grab' : '';
      this.pushHistoryState();
      this.renderPreview();
    }
  },

  handleTouchEnd(e) {
    if (this.gestureHandler && this.gestureHandler.handleTouchEnd(e)) {
      return;
    }
    this.handlePointerUp();
  }
};
