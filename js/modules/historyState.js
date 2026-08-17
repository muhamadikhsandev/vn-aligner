import { HistoryManager } from './history.js';

export const historyMgr = new HistoryManager(50);

export const historyActions = {
  get canUndo() { 
    this.historyTick;
    return historyMgr.canUndo(); 
  },
  
  get canRedo() { 
    this.historyTick;
    return historyMgr.canRedo(); 
  },

  get hasAssets() {
    return this.bodyAssetList.length > 0 || this.faceAssetList.length > 0;
  },

  get isReady() {
    return true;
  },

  get currentFaceLayerOrder() {
    if (this.layerMode === 'global') return this.globalFaceLayerOrder;
    if (this.faceAssetList[this.activeFaceIndex]) {
      return this.faceAssetList[this.activeFaceIndex].transform.layerOrder || 'above';
    }
    return this.globalFaceLayerOrder;
  },

  setLayerMode(mode) {
    this.layerMode = mode;
    this.pushHistoryState();
    this.renderPreview();
  },

  setFaceLayerOrder(order) {
    if (this.layerMode === 'global') {
      this.globalFaceLayerOrder = order;
    } else if (this.faceAssetList[this.activeFaceIndex]) {
      this.faceAssetList[this.activeFaceIndex].transform.layerOrder = order;
    }
    this.pushHistoryState();
    this.renderPreview();
  },

  getSnapshot() {
    return JSON.stringify({
      CANVAS_W: this.CANVAS_W,
      CANVAS_H: this.CANVAS_H,
      layerMode: this.layerMode,
      globalFaceLayerOrder: this.globalFaceLayerOrder,
      activeBodyIndex: this.activeBodyIndex,
      bodyMode: this.bodyMode,
      globalBodyTransform: this.globalBodyTransform,
      bodyTransforms: this.bodyAssetList.map(b => ({ id: b.id, transform: b.transform })),
      activeFaceIndex: this.activeFaceIndex,
      faceMode: this.faceMode,
      globalFaceTransform: this.globalFaceTransform,
      faceTransforms: this.faceAssetList.map(f => ({ id: f.id, transform: f.transform }))
    });
  },

  pushHistoryState() {
    historyMgr.pushState(this.getSnapshot());
    this.historyTick++;
  },

  applySnapshot(snapJson) {
    if (!snapJson) return;
    historyMgr.isInternalChange = true;
    const data = JSON.parse(snapJson);

    this.CANVAS_W = data.CANVAS_W;
    this.CANVAS_H = data.CANVAS_H;
    this.tempW = data.CANVAS_W;
    this.tempH = data.CANVAS_H;

    if (data.layerMode) this.layerMode = data.layerMode;
    if (data.globalFaceLayerOrder) this.globalFaceLayerOrder = data.globalFaceLayerOrder;

    this.activeBodyIndex = data.activeBodyIndex;
    this.bodyMode = data.bodyMode;
    this.globalBodyTransform = JSON.parse(JSON.stringify(data.globalBodyTransform));
    
    if (data.bodyTransforms && this.bodyAssetList.length > 0) {
      data.bodyTransforms.forEach(bt => {
        const item = this.bodyAssetList.find(b => b.id === bt.id);
        if (item) item.transform = JSON.parse(JSON.stringify(bt.transform));
      });
    }

    this.activeFaceIndex = data.activeFaceIndex;
    this.faceMode = data.faceMode;
    this.globalFaceTransform = JSON.parse(JSON.stringify(data.globalFaceTransform));

    if (data.faceTransforms && this.faceAssetList.length > 0) {
      data.faceTransforms.forEach(ft => {
        const item = this.faceAssetList.find(f => f.id === ft.id);
        if (item) item.transform = JSON.parse(JSON.stringify(ft.transform));
      });
    }

    this.renderPreview();
    this.$nextTick(() => { historyMgr.isInternalChange = false; });
  },

  undo() {
    if (!this.canUndo || this.isLocked) return;
    const snap = historyMgr.undo();
    if (snap) {
      this.applySnapshot(snap);
      this.historyTick++;
    }
  },

  redo() {
    if (!this.canRedo || this.isLocked) return;
    const snap = historyMgr.redo();
    if (snap) {
      this.applySnapshot(snap);
      this.historyTick++;
    }
  }
};
