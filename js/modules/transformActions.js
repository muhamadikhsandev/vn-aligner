import { defaultTransform, defaultFaceShape } from './transform.js';
import { FaceRegistry } from './registry.js';
import { refreshLucideIcons } from '../app.js';

export const transformActions = {
  get currentFaceTransform() {
    if (this.faceMode === 'global') return this.globalFaceTransform;
    if (this.faceAssetList[this.activeFaceIndex]) return this.faceAssetList[this.activeFaceIndex].transform;
    return this.globalFaceTransform;
  },

  get currentBodyTransform() {
    if (this.bodyMode === 'global') return this.globalBodyTransform;
    if (this.bodyAssetList[this.activeBodyIndex]) return this.bodyAssetList[this.activeBodyIndex].transform;
    return this.globalBodyTransform;
  },

  get currentTransform() {
    return (this.activeTarget === 'face') ? this.currentFaceTransform : this.currentBodyTransform;
  },

  get currentBoxWidth() {
    const rect = (this.activeTarget === 'face') ? this.getCurrentFaceRect() : this.getCurrentBodyRect();
    return rect ? rect.w : 0;
  },

  get currentBoxHeight() {
    const rect = (this.activeTarget === 'face') ? this.getCurrentFaceRect() : this.getCurrentBodyRect();
    return rect ? rect.h : 0;
  },

  rotateBy(delta) {
    if (this.isLocked) return;
    const current = this.currentTransform.rotation || 0;
    let next = (current + delta) % 360;
    if (next > 180) next -= 360;
    if (next < -180) next += 360;
    this.updateTransform('rotation', next);
    this.pushHistoryState();
  },

  setRotation(angle) {
    if (this.isLocked) return;
    this.updateTransform('rotation', angle);
    this.pushHistoryState();
  },

  toggleFlip(prop) {
    if (this.isLocked) return;
    const current = !!this.currentTransform[prop];
    this.updateTransform(prop, !current);
    this.pushHistoryState();
  },

  resetRotationFlip() {
    if (this.isLocked) return;
    this.updateTransform('rotation', 0);
    this.updateTransform('flipH', false);
    this.updateTransform('flipV', false);
    this.pushHistoryState();
  },

  setFaceMode(mode) { 
    this.faceMode = mode; 
    this.pushHistoryState(); 
  },

  setBodyMode(mode) { 
    this.bodyMode = mode; 
    this.pushHistoryState(); 
  },

  updateFaceTransform(key, val) {
    const finalVal = (typeof val === 'boolean') ? val : (isNaN(parseFloat(val)) ? 0 : parseFloat(val));
    if (this.faceMode === 'global') {
      this.globalFaceTransform[key] = finalVal;
    } else if (this.faceAssetList[this.activeFaceIndex]) {
      this.faceAssetList[this.activeFaceIndex].transform[key] = finalVal;
    }
    this.renderPreview();
  },

  updateBodyTransform(key, val) {
    const finalVal = (typeof val === 'boolean') ? val : (isNaN(parseFloat(val)) ? 0 : parseFloat(val));
    if (this.bodyMode === 'global') {
      this.globalBodyTransform[key] = finalVal;
    } else if (this.bodyAssetList[this.activeBodyIndex]) {
      this.bodyAssetList[this.activeBodyIndex].transform[key] = finalVal;
    }
    this.renderPreview();
  },

  updateTransform(key, val) {
    if (this.activeTarget === 'face') {
      this.updateFaceTransform(key, val);
    } else {
      this.updateBodyTransform(key, val);
    }
  },

  updateFaceReshape(key, val) {
    const numVal = isNaN(parseFloat(val)) ? 0 : parseFloat(val);
    const targetTrans = this.currentFaceTransform;
    if (!targetTrans.reshape) {
      targetTrans.reshape = defaultFaceShape();
    }
    targetTrans.reshape[key] = numVal;
    this.renderPreview();
  },

  resetFaceReshape() {
    if (this.isLocked) return;
    const targetTrans = this.currentFaceTransform;
    targetTrans.reshape = defaultFaceShape();
    this.selectedContourPointIndex = 0;
    this.pushHistoryState();
    this.renderPreview();
  },

  applyHijabPreset() {
    if (this.isLocked) return;
    this.pushHistoryState();

    if (this.layerMode === 'global') {
      this.globalFaceLayerOrder = 'below';
    } else if (this.faceAssetList[this.activeFaceIndex]) {
      this.faceAssetList[this.activeFaceIndex].transform.layerOrder = 'below';
    }

    const targetTrans = this.currentFaceTransform;
    if (!targetTrans.reshape) targetTrans.reshape = defaultFaceShape();

    targetTrans.reshape.vShape = 18;
    targetTrans.reshape.cheekbones = 12;
    targetTrans.reshape.forehead = -15;
    targetTrans.reshape.chinLength = 8;
    targetTrans.reshape.stretchX = 95;
    targetTrans.reshape.stretchY = 100;

    this.renderPreview();
    this.$nextTick(() => { refreshLucideIcons(); });
  },

  setCornerAnchor(anchor) {
    this.boxAnchor = anchor;
    this.renderPreview();
  },

  updateBoxDimension(dim, val) {
    const targetVal = parseFloat(val);
    if (isNaN(targetVal) || targetVal <= 0) return;
    const isFaceTarget = (this.activeTarget === 'face');
    const rect = isFaceTarget ? this.getCurrentFaceRect() : this.getCurrentBodyRect();
    if (!rect || rect.w <= 0 || rect.h <= 0) return;

    if (dim === 'w') {
      const ratio = targetVal / rect.w;
      if (isFaceTarget) {
        const newStretchX = (this.currentFaceTransform.stretchX || 100) * ratio;
        this.updateFaceTransform('stretchX', Math.round(newStretchX));
        if (this.boxLockAspect) {
          const newStretchY = (this.currentFaceTransform.stretchY || 100) * ratio;
          this.updateFaceTransform('stretchY', Math.round(newStretchY));
        }
      } else {
        const newScale = (this.currentBodyTransform.scale || 100) * ratio;
        this.updateBodyTransform('scale', Math.round(newScale));
      }
    } else if (dim === 'h') {
      const ratio = targetVal / rect.h;
      if (isFaceTarget) {
        const newStretchY = (this.currentFaceTransform.stretchY || 100) * ratio;
        this.updateFaceTransform('stretchY', Math.round(newStretchY));
        if (this.boxLockAspect) {
          const newStretchX = (this.currentFaceTransform.stretchX || 100) * ratio;
          this.updateFaceTransform('stretchX', Math.round(newStretchX));
        }
      } else {
        const newScale = (this.currentBodyTransform.scale || 100) * ratio;
        this.updateBodyTransform('scale', Math.round(newScale));
      }
    }
    this.pushHistoryState();
    this.renderPreview();
  },

  alignBox(mode) {
    const isFaceTarget = (this.activeTarget === 'face');
    const updateFn = isFaceTarget ? (k, v) => this.updateFaceTransform(k, v) : (k, v) => this.updateBodyTransform(k, v);
    const rect = isFaceTarget ? this.getCurrentFaceRect() : this.getCurrentBodyRect();
    if (!rect) return;

    this.pushHistoryState();
    if (mode === 'centerBoth') {
      updateFn('offsetX', 0);
      updateFn('offsetY', 0);
    } else if (mode === 'centerX') {
      updateFn('offsetX', 0);
    } else if (mode === 'centerY') {
      updateFn('offsetY', 0);
    } else if (mode === 'left') {
      const targetX = Math.round(-(this.CANVAS_W - rect.w) / 2);
      updateFn('offsetX', targetX);
    } else if (mode === 'right') {
      const targetX = Math.round((this.CANVAS_W - rect.w) / 2);
      updateFn('offsetX', targetX);
    } else if (mode === 'top') {
      const targetY = Math.round(-(this.CANVAS_H - rect.h) / 2);
      updateFn('offsetY', targetY);
    } else if (mode === 'bottom') {
      const targetY = Math.round((this.CANVAS_H - rect.h) / 2);
      updateFn('offsetY', targetY);
    }
    this.renderPreview();
  },

  fitBoxCanvas() {
    const isFaceTarget = (this.activeTarget === 'face');
    this.pushHistoryState();
    if (isFaceTarget) {
      this.updateFaceTransform('scale', 100);
      this.updateFaceTransform('stretchX', 100);
      this.updateFaceTransform('stretchY', 100);
      this.updateFaceTransform('offsetX', 0);
      this.updateFaceTransform('offsetY', 0);
    } else {
      this.fitBodyToCanvas();
    }
    this.renderPreview();
  },

  resetBox() {
    if (this.isLocked) return;
    this.pushHistoryState();
    if (this.activeTarget === 'face') {
      if (this.faceMode === 'global') this.globalFaceTransform = defaultTransform();
      else if (this.faceAssetList[this.activeFaceIndex]) this.faceAssetList[this.activeFaceIndex].transform = defaultTransform();
    } else {
      if (this.bodyMode === 'global') this.globalBodyTransform = defaultTransform();
      else if (this.bodyAssetList[this.activeBodyIndex]) this.bodyAssetList[this.activeBodyIndex].transform = defaultTransform();
    }
    this.renderPreview();
  },

  nudgePos(axis, amount) {
    if (this.isLocked) return;
    const isFaceTarget = (this.activeTarget === 'face');
    const key = (axis === 'X') ? 'offsetX' : 'offsetY';
    const curVal = isFaceTarget ? this.currentFaceTransform[key] : this.currentBodyTransform[key];
    const updateFn = isFaceTarget ? (k, v) => this.updateFaceTransform(k, v) : (k, v) => this.updateBodyTransform(k, v);
    updateFn(key, Math.round((curVal || 0) + amount));
    this.pushHistoryState();
    this.renderPreview();
  },

  fitBodyToCanvas() {
    if (this.bodyAssetList.length === 0 || !this.bodyAssetList[this.activeBodyIndex]) return;
    const activeBodyMeta = this.bodyAssetList[this.activeBodyIndex];
    const refData = FaceRegistry.get(activeBodyMeta.id);
    if (!refData || !refData.img) return;

    const imgW = refData.w; 
    const imgH = refData.h;
    const curTrans = this.currentBodyTransform;
    const availableHeight = Math.max(1, this.CANVAS_H - curTrans.topPadding);

    const scaleW = this.CANVAS_W / imgW;
    const scaleH = availableHeight / imgH;

    const targetScale = Math.max(scaleW, scaleH);
    const defaultBaseScale = Math.min(this.CANVAS_W / imgW, this.CANVAS_H / imgH);

    const newScale = Math.max(1, Math.min(5000, Math.round((targetScale / defaultBaseScale) * 100)));
    const newOffsetY = Math.round((availableHeight - (imgH * targetScale)) / 2);

    this.updateBodyTransform('scale', newScale);
    this.updateBodyTransform('offsetX', 0);
    this.updateBodyTransform('offsetY', newOffsetY);

    this.pushHistoryState();
    this.renderPreview();
  },

  resetPos() {
    if (this.isLocked) return;
    this.pushHistoryState();
    if (this.faceMode === 'global') this.globalFaceTransform = defaultTransform();
    else if (this.faceAssetList[this.activeFaceIndex]) this.faceAssetList[this.activeFaceIndex].transform = defaultTransform();
    this.resetBodyPos();
  },

  resetBodyPos() {
    if (this.isLocked) return;
    if (this.bodyMode === 'global') this.globalBodyTransform = defaultTransform();
    else if (this.bodyAssetList[this.activeBodyIndex]) this.bodyAssetList[this.activeBodyIndex].transform = defaultTransform();
    this.pushHistoryState();
    this.renderPreview();
  },

  toggleLockImagePosition() {
    this.lockImagePosition = !this.lockImagePosition;
    this.isDragEnabled = !this.lockImagePosition;
    this.renderPreview();
  },

  toggleDragMode() {
    this.isDragEnabled = !this.isDragEnabled;
    this.lockImagePosition = !this.isDragEnabled;
    this.renderPreview();
  }
};
