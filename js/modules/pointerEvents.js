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
    const hitRadius = Math.max(40, 40 * scaleRatio);

    const keys = ['nw', 'ne', 'sw', 'se', 'n', 's', 'w', 'e'];
    for (const key of keys) {
      const h = handles[key];
      const dist = Math.hypot(pos.x - h.x, pos.y - h.y);
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

    // 0. Check Template Contour Point Hit (Mode Shape Face / Cetak Bentuk Wajah)
    if ((this.activeTab === 'shapeFace' || this.isEditingTemplate) && faceRect) {
      const reshape = this.currentFaceTransform.reshape;
      const points = (reshape && Array.isArray(reshape.templatePoints)) ? reshape.templatePoints : [];
      const hitRadius = 52;
      for (let i = 0; i < points.length; i++) {
        const pt = points[i];
        const px = faceRect.x + pt.u * faceRect.w;
        const py = faceRect.y + pt.v * faceRect.h;
        if (Math.hypot(pos.x - px, pos.y - py) <= hitRadius) {
          this.activeTarget = 'face';
          this.selectedContourPointIndex = i;
          this.activePointIndex = i;
          this.dragMode = 'template_point';
          this.isDragging = true;
          this.dragStartX = pos.x;
          this.dragStartY = pos.y;
          if (reshape) reshape.useTemplate = true;
          this.renderPreview();
          return;
        }
      }
    }

    // 1. Check Handle Hit on Active Target First, then Secondary Target
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

    // 2. Prevent image move dragging if isDragEnabled is OFF, lockImagePosition is ON, or inside shape editing mode
    if (!this.isDragEnabled || this.lockImagePosition || this.activeTab === 'shapeFace') {
      return;
    }

    // 3. Move dragging when clicking inside bounding box
    if (faceRect && (pos.x >= faceRect.x && pos.x <= faceRect.x + faceRect.w && pos.y >= faceRect.y && pos.y <= faceRect.y + faceRect.h)) {
      this.activeTarget = 'face'; 
      this.activeHandle = null;
      if (this.activeTab !== 'shapeFace') this.activeTab = 'posFace';
      this.isDragging = true; 
      this.dragMode = 'move';
      this.dragStartX = pos.x; 
      this.dragStartY = pos.y;
      this.initialOffsetX = this.currentFaceTransform.offsetX;
      this.initialOffsetY = this.currentFaceTransform.offsetY;
      this.renderPreview(); 
      return;
    }

    if (bodyRect && (pos.x >= bodyRect.x && pos.x <= bodyRect.x + bodyRect.w && pos.y >= bodyRect.y && pos.y <= bodyRect.y + bodyRect.h)) {
      this.activeTarget = 'body'; 
      this.activeHandle = null;
      if (this.activeTab !== 'shapeFace') this.activeTab = 'posBody';
      this.isDragging = true; 
      this.dragMode = 'move';
      this.dragStartX = pos.x; 
      this.dragStartY = pos.y;
      this.initialOffsetX = this.currentBodyTransform.offsetX;
      this.initialOffsetY = this.currentBodyTransform.offsetY;
      this.renderPreview(); 
      return;
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

    // Hover cursor handle check when not dragging
    if (!this.isDragging && !this.isLocked) {
      const faceRect = this.getCurrentFaceRect();
      const bodyRect = this.getCurrentBodyRect();

      // Check hover template points first
      if ((this.activeTab === 'shapeFace' || this.isEditingTemplate) && faceRect) {
        const reshape = this.currentFaceTransform.reshape;
        const points = (reshape && Array.isArray(reshape.templatePoints)) ? reshape.templatePoints : [];
        let hitPointIdx = null;
        for (let i = 0; i < points.length; i++) {
          const pt = points[i];
          const px = faceRect.x + pt.u * faceRect.w;
          const py = faceRect.y + pt.v * faceRect.h;
          if (Math.hypot(pos.x - px, pos.y - py) <= 36) {
            hitPointIdx = i;
            break;
          }
        }
        if (hitPointIdx !== null) {
          if (canvas) canvas.style.cursor = 'grab';
          if (this.hoveredContourPointIndex !== hitPointIdx) {
            this.hoveredContourPointIndex = hitPointIdx;
            this.renderPreview();
          }
          return;
        } else if (this.hoveredContourPointIndex !== null) {
          this.hoveredContourPointIndex = null;
          if (canvas) canvas.style.cursor = '';
          this.renderPreview();
        }
      }

      const activeRect = (this.activeTarget === 'face') ? faceRect : bodyRect;
      const hit = this.checkHandleHit(pos, activeRect) || this.checkHandleHit(pos, (this.activeTarget === 'face') ? bodyRect : faceRect);
      
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

    // MODE TEMPLATE POINT DRAGGING
    if (this.dragMode === 'template_point') {
      const faceRect = this.getCurrentFaceRect();
      if (faceRect && this.activePointIndex !== null) {
        const reshape = this.currentFaceTransform.reshape;
        if (reshape && Array.isArray(reshape.templatePoints) && reshape.templatePoints[this.activePointIndex]) {
          const newU = Math.max(-0.2, Math.min(1.2, (pos.x - faceRect.x) / faceRect.w));
          const newV = Math.max(-0.2, Math.min(1.2, (pos.y - faceRect.y) / faceRect.h));
          reshape.templatePoints[this.activePointIndex].u = newU;
          reshape.templatePoints[this.activePointIndex].v = newV;
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

    // MODE B: Move Position Dragging
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
      if (canvas) canvas.style.cursor = '';
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
