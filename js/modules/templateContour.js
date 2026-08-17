import { defaultFaceShape } from './transform.js';
import { getDefaultContourPoints, getPresetContourPoints } from './faceReshape.js';

export const templateContourActions = {
  toggleTemplateUse(val) {
    const targetTrans = this.currentFaceTransform;
    if (!targetTrans.reshape) targetTrans.reshape = defaultFaceShape();
    targetTrans.reshape.useTemplate = (val !== undefined) ? val : !targetTrans.reshape.useTemplate;
    this.pushHistoryState();
    this.renderPreview();
  },

  applyContourPreset(presetKey) {
    const targetTrans = this.currentFaceTransform;
    if (!targetTrans.reshape) targetTrans.reshape = defaultFaceShape();
    targetTrans.reshape.templatePoints = getPresetContourPoints(presetKey);
    targetTrans.reshape.useTemplate = true;
    this.selectedContourPointIndex = 0;
    this.pushHistoryState();
    this.renderPreview();
  },

  resetContourPoints() {
    if (this.isLocked) return;
    const targetTrans = this.currentFaceTransform;
    if (!targetTrans.reshape) targetTrans.reshape = defaultFaceShape();
    targetTrans.reshape.templatePoints = getDefaultContourPoints();
    targetTrans.reshape.useTemplate = false;
    this.selectedContourPointIndex = 0;
    this.pushHistoryState();
    this.renderPreview();
  },

  saveCurrentTemplate(name) {
    const tplName = (name || this.newTemplateName || '').trim() || `Template ${this.faceShapeTemplates.length + 1}`;
    const points = this.currentFaceTransform.reshape?.templatePoints || getDefaultContourPoints();
    const newTpl = {
      id: `tpl_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: tplName,
      points: JSON.parse(JSON.stringify(points)),
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    this.faceShapeTemplates.push(newTpl);
    this.selectedTemplateId = newTpl.id;
    this.newTemplateName = '';
    this.pushHistoryState();
    this.renderPreview();
  },

  loadTemplate(tplId) {
    const tpl = this.faceShapeTemplates.find(t => t.id === tplId);
    if (!tpl) return;
    const targetTrans = this.currentFaceTransform;
    if (!targetTrans.reshape) targetTrans.reshape = defaultFaceShape();
    targetTrans.reshape.templatePoints = JSON.parse(JSON.stringify(tpl.points));
    targetTrans.reshape.useTemplate = true;
    this.selectedTemplateId = tplId;
    this.pushHistoryState();
    this.renderPreview();
  },

  deleteTemplate(tplId) {
    this.faceShapeTemplates = this.faceShapeTemplates.filter(t => t.id !== tplId);
    if (this.selectedTemplateId === tplId) this.selectedTemplateId = '';
    this.pushHistoryState();
  },

  addContourPoint() {
    const reshape = this.currentFaceTransform.reshape;
    if (!reshape) return;
    if (!Array.isArray(reshape.templatePoints)) reshape.templatePoints = getDefaultContourPoints();
    const pts = reshape.templatePoints;
    const idx = this.selectedContourPointIndex || 0;
    const nextIdx = (idx + 1) % pts.length;
    const p1 = pts[idx];
    const p2 = pts[nextIdx];
    const newPt = {
      id: Date.now(),
      u: (p1.u + p2.u) / 2,
      v: (p1.v + p2.v) / 2,
      label: `Titik ${pts.length + 1}`
    };
    pts.splice(idx + 1, 0, newPt);
    reshape.useTemplate = true;
    this.selectedContourPointIndex = idx + 1;
    this.pushHistoryState();
    this.renderPreview();
  },

  removeContourPoint(idx) {
    const reshape = this.currentFaceTransform.reshape;
    if (!reshape || !Array.isArray(reshape.templatePoints) || reshape.templatePoints.length <= 4) return;
    const targetIdx = (idx !== undefined) ? idx : this.selectedContourPointIndex;
    reshape.templatePoints.splice(targetIdx, 1);
    if (this.selectedContourPointIndex >= reshape.templatePoints.length) {
      this.selectedContourPointIndex = Math.max(0, reshape.templatePoints.length - 1);
    }
    this.pushHistoryState();
    this.renderPreview();
  }
};
