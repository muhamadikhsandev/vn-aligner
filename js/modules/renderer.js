import { FaceRegistry } from './registry.js';
import { getFaceDimensions, getBodyDimensions } from './transform.js';
import { drawReshapedFace } from './faceReshape.js';

export function drawBackgroundLayer(ctx, appState) {
  if (appState.bgType === 'color') {
    ctx.fillStyle = appState.bgColor;
    ctx.fillRect(0, 0, appState.CANVAS_W, appState.CANVAS_H);
  } else if (appState.bgType === 'image' && appState.bgImgObj) {
    const bgW = appState.bgImgObj.naturalWidth || appState.CANVAS_W;
    const bgH = appState.bgImgObj.naturalHeight || appState.CANVAS_H;
    const scale = Math.max(appState.CANVAS_W / bgW, appState.CANVAS_H / bgH);
    const w = bgW * scale;
    const h = bgH * scale;
    const x = (appState.CANVAS_W - w) / 2;
    const y = (appState.CANVAS_H - h) / 2;
    ctx.drawImage(appState.bgImgObj, x, y, w, h);
  }
}

export function applyEraseStrokes(targetCtx, strokes) {
  if (!strokes || strokes.length === 0) return;
  targetCtx.save();
  targetCtx.globalCompositeOperation = 'destination-out';
  for (let i = 0; i < strokes.length; i++) {
    const s = strokes[i];
    targetCtx.globalAlpha = s.opacity !== undefined ? s.opacity : 1.0;
    targetCtx.beginPath();
    targetCtx.arc(s.x, s.y, (s.size || 30) / 2, 0, Math.PI * 2);
    targetCtx.fill();
    if (i > 0 && strokes[i - 1].isContinuous) {
      targetCtx.lineWidth = s.size || 30;
      targetCtx.lineCap = 'round';
      targetCtx.lineJoin = 'round';
      targetCtx.beginPath();
      targetCtx.moveTo(strokes[i - 1].x, strokes[i - 1].y);
      targetCtx.lineTo(s.x, s.y);
      targetCtx.stroke();
    }
  }
  targetCtx.restore();
}

export function drawBodyLayer(ctx, appState) {
  if (appState.bodyAssetList.length > 0 && appState.bodyAssetList[appState.activeBodyIndex]) {
    const activeBodyMeta = appState.bodyAssetList[appState.activeBodyIndex];
    const refData = FaceRegistry.get(activeBodyMeta.id);
    if (refData && refData.img) {
      const trans = (appState.bodyMode === 'global') ? appState.globalBodyTransform : activeBodyMeta.transform;
      const dimBody = getBodyDimensions(refData.img, trans, appState.CANVAS_W, appState.CANVAS_H);
      const drawBX = Math.round(((appState.CANVAS_W - dimBody.w) / 2) + trans.offsetX);
      const drawBY = Math.round(((appState.CANVAS_H - dimBody.h) / 2) + trans.offsetY + trans.topPadding);
      
      const hasErase = trans.eraseStrokes && trans.eraseStrokes.length > 0;
      const targetCtx = hasErase ? document.createElement('canvas').getContext('2d') : ctx;

      if (hasErase) {
        targetCtx.canvas.width = appState.CANVAS_W;
        targetCtx.canvas.height = appState.CANVAS_H;
      }

      targetCtx.save();
      targetCtx.globalAlpha = trans.onionOpacity;

      const centerX = drawBX + Math.round(dimBody.w / 2);
      const centerY = drawBY + Math.round(dimBody.h / 2);

      targetCtx.translate(centerX, centerY);
      if (trans.rotation) {
        targetCtx.rotate((trans.rotation * Math.PI) / 180);
      }
      if (trans.flipH || trans.flipV) {
        targetCtx.scale(trans.flipH ? -1 : 1, trans.flipV ? -1 : 1);
      }
      targetCtx.translate(-centerX, -centerY);

      targetCtx.drawImage(refData.img, drawBX, drawBY, Math.round(dimBody.w), Math.round(dimBody.h));
      targetCtx.restore();

      if (hasErase) {
        applyEraseStrokes(targetCtx, trans.eraseStrokes);
        ctx.drawImage(targetCtx.canvas, 0, 0);
      }
    }
  }
}

export function drawFaceLayer(ctx, appState) {
  if (appState.faceAssetList.length > 0 && appState.faceAssetList[appState.activeFaceIndex]) {
    const activeMeta = appState.faceAssetList[appState.activeFaceIndex];
    const faceData = FaceRegistry.get(activeMeta.id);
    if (faceData && faceData.img) {
      const trans = (appState.faceMode === 'global') ? appState.globalFaceTransform : activeMeta.transform;
      const dim = getFaceDimensions(faceData.img, trans, appState.CANVAS_W, appState.CANVAS_H);
      const drawX = Math.round(((appState.CANVAS_W - dim.w) / 2) + trans.offsetX);
      const drawY = Math.round(((appState.CANVAS_H - dim.h) / 2) + trans.offsetY);
      
      const hasErase = trans.eraseStrokes && trans.eraseStrokes.length > 0;
      const targetCtx = hasErase ? document.createElement('canvas').getContext('2d') : ctx;

      if (hasErase) {
        targetCtx.canvas.width = appState.CANVAS_W;
        targetCtx.canvas.height = appState.CANVAS_H;
      }

      targetCtx.save();
      targetCtx.globalAlpha = trans.faceOpacity;

      const centerX = drawX + Math.round(dim.w / 2);
      const centerY = drawY + Math.round(dim.h / 2);

      targetCtx.translate(centerX, centerY);
      if (trans.rotation) {
        targetCtx.rotate((trans.rotation * Math.PI) / 180);
      }
      if (trans.flipH || trans.flipV) {
        targetCtx.scale(trans.flipH ? -1 : 1, trans.flipV ? -1 : 1);
      }
      targetCtx.translate(-centerX, -centerY);

      // Render wajah dengan deformasi mesh real-time (atau original jika Before/After aktif)
      const activeReshape = appState.showBeforeAfter ? null : trans.reshape;
      drawReshapedFace(targetCtx, faceData.img, drawX, drawY, Math.round(dim.w), Math.round(dim.h), activeReshape);
      
      targetCtx.restore();

      if (hasErase) {
        applyEraseStrokes(targetCtx, trans.eraseStrokes);
        ctx.drawImage(targetCtx.canvas, 0, 0);
      }
    }
  }
}

export function getHandlePositions(rect) {
  if (!rect) return {};
  const elemCenterX = Math.round(rect.x + rect.w / 2);
  const elemCenterY = Math.round(rect.y + rect.h / 2);
  return {
    nw: { key: 'nw', x: rect.x, y: rect.y, cursor: 'nwse-resize', isCorner: true },
    ne: { key: 'ne', x: rect.x + rect.w, y: rect.y, cursor: 'nesw-resize', isCorner: true },
    sw: { key: 'sw', x: rect.x, y: rect.y + rect.h, cursor: 'nesw-resize', isCorner: true },
    se: { key: 'se', x: rect.x + rect.w, y: rect.y + rect.h, cursor: 'nwse-resize', isCorner: true },
    n:  { key: 'n',  x: elemCenterX, y: rect.y, cursor: 'ns-resize', isCorner: false },
    s:  { key: 's',  x: elemCenterX, y: rect.y + rect.h, cursor: 'ns-resize', isCorner: false },
    w:  { key: 'w',  x: rect.x, y: elemCenterY, cursor: 'ew-resize', isCorner: false },
    e:  { key: 'e',  x: rect.x + rect.w, y: elemCenterY, cursor: 'ew-resize', isCorner: false }
  };
}

export function drawTemplateContourOverlay(ctx, appState) {
  if (appState.hideAllOverlays) {
    return;
  }

  const trans = appState.currentFaceTransform;
  const reshape = (trans && trans.reshape) ? trans.reshape : {};

  const isTemplateActive = reshape.useTemplate || appState.showTemplateOutline || appState.isEditingTemplate || appState.activeTab === 'shapeFace';
  if (!isTemplateActive) {
    return;
  }

  // Top Notification Badge for Gesture Tarik Mode
  const badgeText = `MODE BENTUK WAJAH  •  Gesture Tarik Aktif  •  Tarik Area Wajah Langsung Pada Canvas`;
  ctx.font = 'bold 10px sans-serif';
  const textWidth = ctx.measureText(badgeText).width;
  const badgeX = Math.max(10, Math.min(appState.CANVAS_W - textWidth - 20, (appState.CANVAS_W - textWidth) / 2));
  const badgeY = 24;

  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 1.5;

  ctx.beginPath();
  ctx.roundRect(badgeX - 8, badgeY - 14, textWidth + 16, 20, 6);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#38bdf8';
  ctx.fillText(badgeText, badgeX, badgeY);

  ctx.restore();
}

export function drawAlignmentGuidelines(ctx, appState) {
  if (appState.showBox === false || appState.hideAllOverlays) {
    return;
  }

  const isFaceTarget = (appState.activeTarget === 'face');
  const rect = isFaceTarget ? appState.getCurrentFaceRect() : appState.getCurrentBodyRect();
  
  const canvasW = appState.CANVAS_W;
  const canvasH = appState.CANVAS_H;
  const centerX = Math.round(canvasW / 2);
  const centerY = Math.round(canvasH / 2);

  ctx.save();

  // 1. Garis Sumbu Alignment (Saat Dragging atau Aktif)
  if (appState.isDragging || appState.showGuidelines) {
    // Garis Sumbu Vertikal (Center X Alignment Line)
    ctx.beginPath();
    ctx.setLineDash(appState.isSnappedX ? [] : [6, 4]);
    ctx.lineWidth = appState.isSnappedX ? 2.5 : 1.5;
    ctx.strokeStyle = appState.isSnappedX ? '#10b981' : '#06b6d4';
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, canvasH);
    ctx.stroke();

    // Garis Sumbu Horisontal (Center Y Alignment Line)
    ctx.beginPath();
    ctx.setLineDash(appState.isSnappedY ? [] : [6, 4]);
    ctx.lineWidth = appState.isSnappedY ? 2.5 : 1.5;
    ctx.strokeStyle = appState.isSnappedY ? '#10b981' : '#06b6d4';
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvasW, centerY);
    ctx.stroke();
  }

  // 2. Garis Bounding Box & Titik Handle Sudut Super Lengkap (EXTRA LARGE)
  if (rect && appState.isSelected && (appState.showGuidelines || appState.activeTab === 'box' || appState.showBox !== false)) {
    const elemCenterX = Math.round(rect.x + rect.w / 2);
    const elemCenterY = Math.round(rect.y + rect.h / 2);

    if (appState.isDragging || appState.showGuidelines || appState.activeTab === 'box') {
      // Dotted Crosshair Aset ke Sumbu Canvas
      ctx.beginPath();
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#ec4899';
      ctx.moveTo(elemCenterX, 0); ctx.lineTo(elemCenterX, canvasH);
      ctx.moveTo(0, elemCenterY); ctx.lineTo(canvasW, elemCenterY);
      ctx.stroke();
    }

    // Bounding Box Border (Glow effect saat dragging handle)
    const primaryColor = isFaceTarget ? (appState.activeTab === 'box' ? '#06b6d4' : '#38bdf8') : '#3b82f6';
    const accentColor = isFaceTarget ? (appState.activeTab === 'box' ? '#0891b2' : '#0284c7') : '#1d4ed8';

    ctx.setLineDash([]);
    ctx.lineWidth = appState.isDragging ? 3 : 2.5;
    ctx.strokeStyle = primaryColor;
    ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);

    // Center Anchor Point Dot
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = '#38bdf8';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.arc(elemCenterX, elemCenterY, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Render 8 Interactive Circle Handle Points (4 Corner Circles for Perkecil/Scale + 4 Edge Circles for Perlebar/Width)
    const handles = getHandlePositions(rect);
    const handleKeys = ['nw', 'ne', 'sw', 'se', 'n', 's', 'w', 'e'];
    const baseHandleSize = appState.handleSize || 48;
    
    handleKeys.forEach(key => {
      const h = handles[key];
      const isHoveredOrActive = (appState.activeHandle === key);
      const isAnchorSelected = (appState.boxAnchor === key);

      const size = h.isCorner 
        ? (isHoveredOrActive ? baseHandleSize + 16 : (isAnchorSelected ? baseHandleSize + 12 : baseHandleSize + 6)) 
        : (isHoveredOrActive ? baseHandleSize + 12 : baseHandleSize + 2);

      const radius = size / 2;
      const strokeW = isHoveredOrActive || isAnchorSelected ? 6 : 4.5;
      const totalRadius = radius + strokeW / 2 + 2; // include stroke + 2px margin

      // Clamp draw position so circle is never cut off by canvas edge
      const dx = Math.max(totalRadius, Math.min(canvasW - totalRadius, h.x));
      const dy = Math.max(totalRadius, Math.min(canvasH - totalRadius, h.y));

      ctx.save();
      // Drop shadow for high contrast
      ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
      ctx.shadowBlur = 18;
      
      // Handle fill and stroke styling
      ctx.fillStyle = isAnchorSelected ? '#f59e0b' : (isHoveredOrActive ? primaryColor : '#ffffff');
      ctx.strokeStyle = isHoveredOrActive ? '#ffffff' : (isAnchorSelected ? '#fef3c7' : accentColor);
      ctx.lineWidth = strokeW;

      ctx.beginPath();
      // All 8 Box Handles are CIRCLE (Lingkaran Sudut Box) for Perkecil / Perlebar / Scale
      ctx.arc(dx, dy, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Inner indicator core dot
      ctx.beginPath();
      ctx.fillStyle = isHoveredOrActive || isAnchorSelected ? '#ffffff' : primaryColor;
      ctx.arc(dx, dy, Math.max(6, size / 3.2), 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });

    // Badge Teks Presisi Koordinat & Skala
    const trans = isFaceTarget ? appState.currentFaceTransform : appState.currentBodyTransform;
    const badgeText = `${isFaceTarget ? 'WAJAH BOX' : 'BADAN BOX'}  ${rect.w}x${rect.h}px  Skala:${trans.scale}%  X:${trans.offsetX >= 0 ? '+' : ''}${trans.offsetX}px  Y:${trans.offsetY >= 0 ? '+' : ''}${trans.offsetY}px`;

    ctx.font = 'bold 11px sans-serif';
    const textWidth = ctx.measureText(badgeText).width;
    const badgeX = Math.max(10, Math.min(canvasW - textWidth - 20, rect.x + (rect.w - textWidth)/2));
    const badgeY = Math.max(25, rect.y - 12);

    // Pill background
    ctx.fillStyle = 'rgba(2, 6, 23, 0.95)';
    ctx.strokeStyle = appState.isSnappedX || appState.isSnappedY ? '#10b981' : primaryColor;
    ctx.lineWidth = 1.5;
    
    ctx.beginPath();
    ctx.roundRect(badgeX - 6, badgeY - 14, textWidth + 12, 20, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = appState.isSnappedX || appState.isSnappedY ? '#34d399' : primaryColor;
    ctx.fillText(badgeText, badgeX, badgeY);
  }

  // 3. Render Face Shape Template Contour Overlay
  drawTemplateContourOverlay(ctx, appState);

  ctx.restore();
}

export function drawCanvas(canvas, appState) {
  if (!canvas) return;
  canvas.width = appState.CANVAS_W;
  canvas.height = appState.CANVAS_H;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, appState.CANVAS_W, appState.CANVAS_H);

  // Render Background Preview
  drawBackgroundLayer(ctx, appState);

  const isFaceBelow = appState.currentFaceLayerOrder === 'below';

  if (isFaceBelow) {
    drawFaceLayer(ctx, appState);
    drawBodyLayer(ctx, appState);
  } else {
    drawBodyLayer(ctx, appState);
    drawFaceLayer(ctx, appState);
  }

  // Render Garis Presisi & Bounding Box Handles
  drawAlignmentGuidelines(ctx, appState);

  // Render Brush Eraser Indicator Ring (Saat Mode Brush Hapus Aktif)
  if (appState.isEraserActive && appState.activePointerPos) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(appState.activePointerPos.x, appState.activePointerPos.y, (appState.brushSize || 30) / 2, 0, Math.PI * 2);
    ctx.setLineDash([4, 3]);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#f43f5e';
    ctx.stroke();
    ctx.fillStyle = 'rgba(244, 63, 94, 0.18)';
    ctx.fill();

    // Crosshair dot in center of brush
    ctx.beginPath();
    ctx.arc(appState.activePointerPos.x, appState.activePointerPos.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.restore();
  }

  // Render Pen & Touch Pointer Indicator Overlay (Terlihat di Mobile & Desktop saat Dragging/Touching)
  if (appState.activePointerPos && (appState.isDragging || appState.activeTab === 'shapeFace')) {
    const px = appState.activePointerPos.x;
    const py = appState.activePointerPos.y;
    ctx.save();
    
    // Glowing Pen Ring
    ctx.shadowColor = 'rgba(56, 189, 248, 0.85)';
    ctx.shadowBlur = 12;
    
    ctx.beginPath();
    ctx.arc(px, py, 12, 0, Math.PI * 2);
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#38bdf8';
    ctx.stroke();

    // Center Bright Core Dot
    ctx.beginPath();
    ctx.arc(px, py, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // Crosshair Hairlines
    ctx.beginPath();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#38bdf8';
    ctx.moveTo(px - 18, py); ctx.lineTo(px - 13, py);
    ctx.moveTo(px + 13, py); ctx.lineTo(px + 18, py);
    ctx.moveTo(px, py - 18); ctx.lineTo(px, py - 13);
    ctx.moveTo(px, py + 13); ctx.lineTo(px, py + 18);
    ctx.stroke();

    ctx.restore();
  }
}

export function renderItemToCanvas(faceItem = null, bodyItem = null, appState) {
  const exportCanvas = document.createElement('canvas');
  
  const canvasW = bodyItem ? bodyItem.w : appState.CANVAS_W;
  const canvasH = bodyItem ? bodyItem.h : appState.CANVAS_H;

  exportCanvas.width = canvasW; 
  exportCanvas.height = canvasH;
  const ctx = exportCanvas.getContext('2d');

  const faceOrder = (appState.layerMode === 'global') 
    ? appState.globalFaceLayerOrder 
    : (faceItem ? (faceItem.transform.layerOrder || 'above') : 'above');

  const renderBody = () => {
    if ((appState.exportMode === 'merged' || appState.exportMode === 'body_only') && bodyItem) {
      const refData = FaceRegistry.get(bodyItem.id);
      if (refData && refData.img) {
        const trans = (appState.bodyMode === 'global') ? appState.globalBodyTransform : bodyItem.transform;
        const dimBody = getBodyDimensions(refData.img, trans, canvasW, canvasH);
        const drawBX = Math.round(((canvasW - dimBody.w) / 2) + trans.offsetX);
        const drawBY = Math.round(((canvasH - dimBody.h) / 2) + trans.offsetY + trans.topPadding);

        const hasErase = trans.eraseStrokes && trans.eraseStrokes.length > 0;
        const targetCtx = hasErase ? document.createElement('canvas').getContext('2d') : ctx;

        if (hasErase) {
          targetCtx.canvas.width = canvasW;
          targetCtx.canvas.height = canvasH;
        }

        targetCtx.save();
        const centerX = drawBX + Math.round(dimBody.w / 2);
        const centerY = drawBY + Math.round(dimBody.h / 2);

        targetCtx.translate(centerX, centerY);
        if (trans.rotation) targetCtx.rotate((trans.rotation * Math.PI) / 180);
        if (trans.flipH || trans.flipV) targetCtx.scale(trans.flipH ? -1 : 1, trans.flipV ? -1 : 1);
        targetCtx.translate(-centerX, -centerY);

        targetCtx.drawImage(refData.img, drawBX, drawBY, Math.round(dimBody.w), Math.round(dimBody.h));
        targetCtx.restore();

        if (hasErase) {
          applyEraseStrokes(targetCtx, trans.eraseStrokes);
          ctx.drawImage(targetCtx.canvas, 0, 0);
        }
      }
    }
  };

  const renderFace = () => {
    if ((appState.exportMode === 'merged' || appState.exportMode === 'head_only') && faceItem) {
      const faceData = FaceRegistry.get(faceItem.id);
      if (faceData && faceData.img) {
        const trans = (appState.faceMode === 'global') ? appState.globalFaceTransform : faceItem.transform;
        const dim = getFaceDimensions(faceData.img, trans, canvasW, canvasH);
        const drawX = Math.round(((canvasW - dim.w) / 2) + trans.offsetX);
        const drawY = Math.round(((canvasH - dim.h) / 2) + trans.offsetY);
        
        const hasErase = trans.eraseStrokes && trans.eraseStrokes.length > 0;
        const targetCtx = hasErase ? document.createElement('canvas').getContext('2d') : ctx;

        if (hasErase) {
          targetCtx.canvas.width = canvasW;
          targetCtx.canvas.height = canvasH;
        }

        targetCtx.save();
        const centerX = drawX + Math.round(dim.w / 2);
        const centerY = drawY + Math.round(dim.h / 2);

        targetCtx.translate(centerX, centerY);
        if (trans.rotation) targetCtx.rotate((trans.rotation * Math.PI) / 180);
        if (trans.flipH || trans.flipV) targetCtx.scale(trans.flipH ? -1 : 1, trans.flipV ? -1 : 1);
        targetCtx.translate(-centerX, -centerY);

        drawReshapedFace(targetCtx, faceData.img, drawX, drawY, Math.round(dim.w), Math.round(dim.h), trans.reshape);
        targetCtx.restore();

        if (hasErase) {
          applyEraseStrokes(targetCtx, trans.eraseStrokes);
          ctx.drawImage(targetCtx.canvas, 0, 0);
        }
      }
    }
  };

  if (faceOrder === 'below') {
    renderFace();
    renderBody();
  } else {
    renderBody();
    renderFace();
  }

  return exportCanvas;
}
