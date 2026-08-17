import { FaceRegistry, createThumbnail, registerAsset } from './registry.js';
import { defaultTransform } from './transform.js';
import { refreshLucideIcons } from '../app.js';

export const assetManagerActions = {
  handleBgImageUpload(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    this.bgFileName = file.name;
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      this.bgImgObj = img;
      this.bgType = 'image';
      this.pushHistoryState();
      this.renderPreview();
    };
    img.src = objectUrl;
  },

  handleRefUpload(e) {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    this.refFileName = `${files.length} Badan Dipilih`;

    const promises = files.map((file, index) => {
      return new Promise((resolve) => {
        const objectUrl = URL.createObjectURL(file);
        const img = new Image();
        img.onload = async () => {
          const uniqueId = `body_${Date.now()}_${index}_${Math.random().toString(36).substring(2, 6)}`;
          const nw = img.naturalWidth || 600; 
          const nh = img.naturalHeight || 800;
          registerAsset(uniqueId, objectUrl, img, nw, nh);

          const thumb = createThumbnail(img, nw, nh);

          resolve({
            id: uniqueId,
            order: index,
            name: file.name.replace(/\.[^/.]+$/, ""),
            thumb: thumb,
            w: nw, 
            h: nh,
            transform: defaultTransform()
          });
        };
        img.src = objectUrl;
      });
    });

    Promise.all(promises).then((results) => {
      this.bodyAssetList = results.filter(i => i !== null);
      this.activeBodyIndex = 0;
      
      if (this.bodyAssetList.length > 0) {
        const firstBody = this.bodyAssetList[0];
        this.CANVAS_W = firstBody.w;
        this.CANVAS_H = firstBody.h;
        this.tempW = firstBody.w;
        this.tempH = firstBody.h;
      }

      this.pushHistoryState();
      this.$nextTick(() => { 
        refreshLucideIcons();
        this.renderPreview(); 
      });
    });
  },

  handleFacesUpload(e) {
    this.stopAutoPlayFace();
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    this.faceFileName = `${files.length} Wajah Dipilih`;

    const promises = files.map((file, index) => {
      return new Promise((resolve) => {
        const objectUrl = URL.createObjectURL(file);
        const img = new Image();
        img.onload = async () => {
          const uniqueId = `face_${Date.now()}_${index}_${Math.random().toString(36).substring(2, 6)}`;
          const nw = img.naturalWidth || 600; 
          const nh = img.naturalHeight || 800;
          registerAsset(uniqueId, objectUrl, img, nw, nh);

          const thumb = createThumbnail(img, nw, nh);

          resolve({
            id: uniqueId,
            order: index,
            name: file.name.replace(/\.[^/.]+$/, ""),
            thumb: thumb,
            w: nw, 
            h: nh,
            transform: defaultTransform()
          });
        };
        img.src = objectUrl;
      });
    });

    Promise.all(promises).then((results) => {
      this.faceAssetList = results.filter(i => i !== null);
      this.activeFaceIndex = 0;
      this.activeTab = 'posFace';
      this.pushHistoryState();
      this.$nextTick(() => { 
        refreshLucideIcons();
        this.renderPreview(); 
      });
    });
  },

  selectBody(idx) { 
    this.stopAutoPlayBody(); 
    this.activeBodyIndex = idx; 
    this.activeTarget = 'body'; 

    if (this.bodyAssetList[idx]) {
      this.CANVAS_W = this.bodyAssetList[idx].w;
      this.CANVAS_H = this.bodyAssetList[idx].h;
      this.tempW = this.bodyAssetList[idx].w;
      this.tempH = this.bodyAssetList[idx].h;
    }

    this.pushHistoryState(); 
    this.renderPreview(); 
  },
  
  selectFace(idx) { 
    this.stopAutoPlayFace(); 
    this.activeFaceIndex = idx; 
    this.activeTarget = 'face'; 
    this.pushHistoryState(); 
    this.renderPreview(); 
  },

  togglePlayFace() { 
    if (this.isPlayingFace) this.stopAutoPlayFace(); 
    else this.startAutoPlayFace(); 
  },

  startAutoPlayFace() {
    if (this.faceAssetList.length <= 1) return;
    this.isPlayingFace = true;
    this.playIntervalFace = setInterval(() => {
      this.activeFaceIndex = (this.activeFaceIndex + 1) % this.faceAssetList.length;
      this.renderPreview();
    }, 450);
  },

  stopAutoPlayFace() { 
    if (this.isPlayingFace) { 
      this.isPlayingFace = false; 
      clearInterval(this.playIntervalFace); 
    } 
  },

  togglePlayBody() { 
    if (this.isPlayingBody) this.stopAutoPlayBody(); 
    else this.startAutoPlayBody(); 
  },

  startAutoPlayBody() {
    if (this.bodyAssetList.length <= 1) return;
    this.isPlayingBody = true;
    this.playIntervalBody = setInterval(() => {
      this.selectBody((this.activeBodyIndex + 1) % this.bodyAssetList.length);
    }, 500);
  },

  stopAutoPlayBody() { 
    if (this.isPlayingBody) { 
      this.isPlayingBody = false; 
      clearInterval(this.playIntervalBody); 
    } 
  },

  deleteActiveFaceAsset() {
    if (this.isLocked || this.faceAssetList.length === 0) return;
    this.faceAssetList.splice(this.activeFaceIndex, 1);
    if (this.activeFaceIndex >= this.faceAssetList.length) {
      this.activeFaceIndex = Math.max(0, this.faceAssetList.length - 1);
    }
    if (this.faceAssetList.length > 0) {
      this.faceFileName = this.faceAssetList[this.activeFaceIndex].name;
    } else {
      this.faceFileName = 'Pilih Multi Aset Wajah';
    }
    this.pushHistoryState();
    this.renderPreview();
  },

  deleteActiveBodyAsset() {
    if (this.isLocked || this.bodyAssetList.length === 0) return;
    this.bodyAssetList.splice(this.activeBodyIndex, 1);
    if (this.activeBodyIndex >= this.bodyAssetList.length) {
      this.activeBodyIndex = Math.max(0, this.bodyAssetList.length - 1);
    }
    if (this.bodyAssetList.length > 0) {
      this.refFileName = this.bodyAssetList[this.activeBodyIndex].name;
    } else {
      this.refFileName = 'Pilih Multi Badan Acuan';
    }
    this.pushHistoryState();
    this.renderPreview();
  },

  clearAllFaceAssets() {
    if (this.isLocked || this.faceAssetList.length === 0) return;
    if (confirm('Hapus seluruh daftar aset wajah?')) {
      this.stopAutoPlayFace();
      this.faceAssetList = [];
      this.activeFaceIndex = 0;
      this.faceFileName = 'Pilih Multi Aset Wajah';
      this.pushHistoryState();
      this.renderPreview();
    }
  },

  clearAllBodyAssets() {
    if (this.isLocked || this.bodyAssetList.length === 0) return;
    if (confirm('Hapus seluruh daftar aset badan?')) {
      this.pushHistoryState();
      this.stopAutoPlayBody();
      this.bodyAssetList = [];
      this.activeBodyIndex = 0;
      this.refFileName = 'Pilih Multi Badan Acuan';
      this.renderPreview();
    }
  },

  fullResetAll() {
    if (confirm('Reset total seluruh proyek & hapus semua aset?')) {
      this.stopAutoPlayFace();
      this.stopAutoPlayBody();
      this.faceAssetList = [];
      this.bodyAssetList = [];
      this.activeFaceIndex = 0;
      this.activeBodyIndex = 0;
      this.faceFileName = 'Pilih Multi Aset Wajah';
      this.refFileName = 'Pilih Multi Badan Acuan';
      this.globalFaceTransform = defaultTransform();
      this.globalBodyTransform = defaultTransform();
      this.bgType = 'transparent';
      this.showBox = true;
      this.showPolygon = true;
      this.hideAllOverlays = false;
      this.renderPreview();
    }
  },

  hexToRgb(hex) {
    let c = (hex || '#ffffff').replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const num = parseInt(c, 16) || 0;
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255
    };
  },

  rgbToHex(r, g, b) {
    const toHex = (n) => {
      const hex = Math.max(0, Math.min(255, Math.round(n))).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  },

  setBgColor(hex) {
    this.bgColor = hex;
    this.bgRgb = this.hexToRgb(hex);
    this.bgType = 'color';
    this.renderPreview();
  },

  updateBgRgb(channel, val) {
    const numVal = Math.max(0, Math.min(255, parseInt(val) || 0));
    this.bgRgb[channel] = numVal;
    this.bgColor = this.rgbToHex(this.bgRgb.r, this.bgRgb.g, this.bgRgb.b);
    this.bgType = 'color';
    this.renderPreview();
  },

  updateBgHex(val) {
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      this.setBgColor(val);
    }
  }
};
