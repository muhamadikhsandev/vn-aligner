/**
 * Engine Deformation Shapes Wajah (Mesh Warping 2D)
 * Mengubah bentuk wajah (Rahang/V-Shape, Pipi, Dahi, Dagu, Mata, Hidung) serta Target Face Shape Template.
 */

// Cache Canvas Offscreen untuk menghindari re-allocation berlebih
let warpCanvas = null;
let warpCtx = null;

function getWarpCanvas(w, h) {
  if (!warpCanvas) {
    warpCanvas = document.createElement('canvas');
    warpCtx = warpCanvas.getContext('2d');
  }
  if (warpCanvas.width !== w || warpCanvas.height !== h) {
    warpCanvas.width = w;
    warpCanvas.height = h;
  }
  warpCtx.clearRect(0, 0, w, h);
  return { canvas: warpCanvas, ctx: warpCtx };
}

/**
 * 12-point Default Oval Contour (Normalized 0.0 - 1.0)
 */
export function getDefaultContourPoints() {
  return [
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

/**
 * Built-in Preset Shapes (Normalized 0.0 - 1.0)
 */
export function getPresetContourPoints(presetName) {
  const points = getDefaultContourPoints();
  if (presetName === 'vShape') {
    // V-Shape / Tirus Sharp Jaw
    points[4].u = 0.78; points[4].v = 0.73;
    points[5].u = 0.60; points[5].v = 0.92;
    points[6].v = 0.98;
    points[7].u = 0.40; points[7].v = 0.92;
    points[8].u = 0.22; points[8].v = 0.73;
  } else if (presetName === 'hijabHole') {
    // Pas Lubang Hijab / Kerudung Oval Ramping
    points[1].u = 0.68; points[1].v = 0.15;
    points[2].u = 0.82; points[2].v = 0.30;
    points[3].u = 0.88; points[3].v = 0.52;
    points[4].u = 0.78; points[4].v = 0.75;
    points[5].u = 0.62; points[5].v = 0.91;
    points[6].v = 0.96;
    points[7].u = 0.38; points[7].v = 0.91;
    points[8].u = 0.22; points[8].v = 0.75;
    points[9].u = 0.12; points[9].v = 0.52;
    points[10].u = 0.18; points[10].v = 0.30;
    points[11].u = 0.32; points[11].v = 0.15;
  } else if (presetName === 'round') {
    // Bulat / Chubby Round
    points[3].u = 0.98; points[4].u = 0.90;
    points[9].u = 0.02; points[8].u = 0.10;
    points[6].v = 0.92;
  } else if (presetName === 'square') {
    // Kotak / Square Jaw
    points[4].u = 0.92; points[4].v = 0.80;
    points[8].u = 0.08; points[8].v = 0.80;
  }
  return points;
}

/**
 * Memeriksa apakah parameter reshape memiliki nilai non-default.
 */
export function isReshaped(r) {
  if (!r) return false;

  const hasSliderReshape = (
    (r.vShape || 0) !== 0 ||
    (r.cheekbones || 0) !== 0 ||
    (r.forehead || 0) !== 0 ||
    (r.chinLength || 0) !== 0 ||
    (r.eyebrowY || 0) !== 0 ||
    (r.eyebrowAngle || 0) !== 0 ||
    (r.eyeScale !== undefined && r.eyeScale !== 100) ||
    (r.eyeDistance || 0) !== 0 ||
    (r.eyeY || 0) !== 0 ||
    (r.noseWidth !== undefined && r.noseWidth !== 100) ||
    (r.noseY || 0) !== 0 ||
    (r.mouthWidth !== undefined && r.mouthWidth !== 100) ||
    (r.mouthScale !== undefined && r.mouthScale !== 100) ||
    (r.mouthY || 0) !== 0
  );

  if (hasSliderReshape) return true;

  if (r.useTemplate && Array.isArray(r.templatePoints) && r.templatePoints.length > 0) {
    const defaultPts = getDefaultContourPoints();
    if (r.templatePoints.length !== defaultPts.length) return true;
    for (let i = 0; i < r.templatePoints.length; i++) {
      const tp = r.templatePoints[i];
      const dp = defaultPts[i];
      if (dp && (Math.abs(tp.u - dp.u) > 0.005 || Math.abs(tp.v - dp.v) > 0.005)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Render gambar wajah dengan deformasi bentuk wajah parametrik & Template Target Shape ke target Canvas Context.
 */
export function drawReshapedFace(targetCtx, img, drawX, drawY, drawW, drawH, reshapeParams) {
  const r = reshapeParams || {};
  
  // Jika tidak ada efek deformasi, langsung gambar biasa (performa maksimal)
  if (!isReshaped(r)) {
    targetCtx.drawImage(img, drawX, drawY, drawW, drawH);
    return;
  }

  const gridCols = 16;
  const gridRows = 16;
  const imgW = img.naturalWidth || 600;
  const imgH = img.naturalHeight || 800;

  const { canvas: tempCanvas, ctx: tempCtx } = getWarpCanvas(imgW, imgH);
  
  const srcContour = getDefaultContourPoints();
  const tgtContour = (r.useTemplate && Array.isArray(r.templatePoints) && r.templatePoints.length > 0)
    ? r.templatePoints
    : srcContour;

  // Buat koordinat vertex terdeformasi
  const vertices = [];
  for (let rIdx = 0; rIdx <= gridRows; rIdx++) {
    const v = rIdx / gridRows; // 0.0 - 1.0
    vertices[rIdx] = [];

    for (let cIdx = 0; cIdx <= gridCols; cIdx++) {
      const u = cIdx / gridCols; // 0.0 - 1.0

      let newU = u;
      let newV = v;

      const centerU = 0.5;

      // --- A. TEMPLATE SHAPE WARP (Ultra-Smooth Gaussian RBF Deformation) ---
      if (r.useTemplate && tgtContour.length > 0) {
        let totalShiftU = 0;
        let totalShiftV = 0;

        for (let i = 0; i < srcContour.length; i++) {
          const sp = srcContour[i];
          const tp = tgtContour[i] || sp;

          const du = tp.u - sp.u;
          const dv = tp.v - sp.v;

          if (Math.abs(du) < 0.0001 && Math.abs(dv) < 0.0001) continue;

          const dist = Math.hypot(u - sp.u, v - sp.v);
          // Smooth Gaussian Radial Basis Function (RBF) Kernel
          const w = Math.exp(-(dist * dist) / 0.08);

          totalShiftU += du * w;
          totalShiftV += dv * w;
        }

        newU += totalShiftU;
        newV += totalShiftV;
      }

      // --- B. PARAMETRIC SLIDER WARP ---
      // 1. Rahang / V-Shape (v > 0.5)
      if (r.vShape && v > 0.5) {
        const vFactor = Math.sin(((v - 0.5) / 0.5) * (Math.PI / 2));
        const amount = (r.vShape / 100) * 0.22 * vFactor;
        newU = centerU + (newU - centerU) * (1 - amount);
      }

      // 2. Pipi (0.3 < v < 0.7)
      if (r.cheekbones && v > 0.3 && v < 0.7) {
        const cheekFactor = Math.cos(((v - 0.5) / 0.2) * (Math.PI / 2));
        const amount = (r.cheekbones / 100) * 0.18 * Math.max(0, cheekFactor);
        newU = centerU + (newU - centerU) * (1 - amount);
      }

      // 3. Dahi (v < 0.45)
      if (r.forehead && v < 0.45) {
        const foreheadFactor = (0.45 - v) / 0.45;
        const amount = (r.forehead / 100) * 0.20 * foreheadFactor;
        newU = centerU + (newU - centerU) * (1 + amount);
      }

      // 4. Panjang Dagu (v > 0.75)
      if (r.chinLength && v > 0.75) {
        const chinFactor = (v - 0.75) / 0.25;
        const amount = (r.chinLength / 100) * 0.12 * (chinFactor * chinFactor);
        newV = newV + amount;
      }

      // --- C. DEFORMASI ALIS (EYEBROWS: u ~ 0.2..0.8, v ~ 0.20..0.36) ---
      if (v > 0.20 && v < 0.36) {
        const ebWeight = Math.cos(((v - 0.28) / 0.08) * (Math.PI / 2));
        // Tinggi Alis (eyebrowY)
        if (r.eyebrowY) {
          newV += (r.eyebrowY / 100) * 0.07 * Math.max(0, ebWeight);
        }
        // Kemiringan Alis (eyebrowAngle)
        if (r.eyebrowAngle) {
          if (u < 0.5) { // Alis Kiri
            newV += (u - 0.35) * (r.eyebrowAngle / 100) * 0.18 * Math.max(0, ebWeight);
          } else { // Alis Kanan
            newV -= (u - 0.65) * (r.eyebrowAngle / 100) * 0.18 * Math.max(0, ebWeight);
          }
        }
      }

      // --- D. DEFORMASI MATA (EYES: u ~ 0.2..0.8, v ~ 0.28..0.52) ---
      if (v > 0.28 && v < 0.52) {
        const eyeWeight = Math.max(0, Math.cos(((v - 0.38) / 0.12) * (Math.PI / 2)));
        
        // Ukuran Mata (eyeScale)
        const eyeScaleDiff = ((r.eyeScale !== undefined ? r.eyeScale : 100) - 100) / 100;
        if (eyeScaleDiff !== 0) {
          const leftEyeU = 0.35, rightEyeU = 0.65, eyeV = 0.38;
          const distL = Math.hypot(u - leftEyeU, v - eyeV);
          const distR = Math.hypot(u - rightEyeU, v - eyeV);
          const minDist = Math.min(distL, distR);
          if (minDist < 0.22) {
            const eyeFactor = Math.cos((minDist / 0.22) * (Math.PI / 2));
            newU = centerU + (newU - centerU) * (1 + eyeScaleDiff * 0.15 * eyeFactor);
            newV = eyeV + (newV - eyeV) * (1 + eyeScaleDiff * 0.15 * eyeFactor);
          }
        }

        // Jarak Antar Mata (eyeDistance)
        if (r.eyeDistance) {
          const shift = (r.eyeDistance / 100) * 0.08 * eyeWeight;
          if (u < 0.5) newU -= shift;
          else if (u > 0.5) newU += shift;
        }

        // Tinggi Posisi Mata (eyeY)
        if (r.eyeY) {
          newV += (r.eyeY / 100) * 0.07 * eyeWeight;
        }
      }

      // --- E. DEFORMASI HIDUNG (NOSE: u ~ 0.38..0.62, v ~ 0.42..0.64) ---
      if (v > 0.42 && v < 0.64 && Math.abs(u - 0.5) < 0.20) {
        const noseWeight = Math.max(0, Math.cos(((v - 0.52) / 0.10) * (Math.PI / 2)) * Math.cos(((u - 0.5) / 0.18) * (Math.PI / 2)));
        
        // Lebar Hidung (noseWidth)
        const noseWidthDiff = ((r.noseWidth !== undefined ? r.noseWidth : 100) - 100) / 100;
        if (noseWidthDiff !== 0) {
          const noseFactor = Math.cos((Math.abs(u - 0.5) / 0.18) * (Math.PI / 2)) * Math.sin(((v - 0.42) / 0.22) * Math.PI);
          newU = centerU + (newU - centerU) * (1 + noseWidthDiff * 0.30 * noseFactor);
        }

        // Tinggi Posisi Hidung (noseY)
        if (r.noseY) {
          newV += (r.noseY / 100) * 0.06 * noseWeight;
        }
      }

      // --- F. DEFORMASI MULUT (MOUTH: u ~ 0.28..0.72, v ~ 0.58..0.78) ---
      if (v > 0.58 && v < 0.78 && Math.abs(u - 0.5) < 0.25) {
        const mouthWeight = Math.max(0, Math.cos(((v - 0.67) / 0.09) * (Math.PI / 2)) * Math.cos(((u - 0.5) / 0.22) * (Math.PI / 2)));
        
        // Lebar Mulut (mouthWidth)
        const mouthWDiff = ((r.mouthWidth !== undefined ? r.mouthWidth : 100) - 100) / 100;
        if (mouthWDiff !== 0) {
          newU = centerU + (newU - centerU) * (1 + mouthWDiff * 0.32 * mouthWeight);
        }

        // Skala Mulut (mouthScale)
        const mouthSDiff = ((r.mouthScale !== undefined ? r.mouthScale : 100) - 100) / 100;
        if (mouthSDiff !== 0) {
          newU = centerU + (newU - centerU) * (1 + mouthSDiff * 0.25 * mouthWeight);
          newV = 0.67 + (newV - 0.67) * (1 + mouthSDiff * 0.25 * mouthWeight);
        }

        // Tinggi Posisi Mulut (mouthY)
        if (r.mouthY) {
          newV += (r.mouthY / 100) * 0.07 * mouthWeight;
        }
      }

      vertices[rIdx][cIdx] = {
        sx: u * imgW,
        sy: v * imgH,
        dx: newU * imgW,
        dy: newV * imgH
      };
    }
  }

  // Render Mesh Triangles ke Canvas Temporer
  for (let rIdx = 0; rIdx < gridRows; rIdx++) {
    for (let cIdx = 0; cIdx < gridCols; cIdx++) {
      const p0 = vertices[rIdx][cIdx];
      const p1 = vertices[rIdx][cIdx + 1];
      const p2 = vertices[rIdx + 1][cIdx];
      const p3 = vertices[rIdx + 1][cIdx + 1];

      // Segitiga 1 (p0, p1, p2)
      drawTriangle(tempCtx, img, p0.sx, p0.sy, p1.sx, p1.sy, p2.sx, p2.sy, p0.dx, p0.dy, p1.dx, p1.dy, p2.dx, p2.dy);
      // Segitiga 2 (p1, p3, p2)
      drawTriangle(tempCtx, img, p1.sx, p1.sy, p3.sx, p3.sy, p2.sx, p2.sy, p1.dx, p1.dy, p3.dx, p3.dy, p2.dx, p2.dy);
    }
  }

  // Gambar hasil warped dari canvas temporer ke target canvas
  targetCtx.drawImage(tempCanvas, drawX, drawY, drawW, drawH);
}

/**
 * Render sub-segitiga affine dari gambar sumber ke target canvas dengan anti-seam overlap.
 */
function drawTriangle(ctx, img, x0, y0, x1, y1, x2, y2, u0, v0, u1, v1, u2, v2) {
  // Hitung centroid (titik pusat) dari segitiga tujuan (u0, v0), (u1, v1), (u2, v2)
  const cx = (u0 + u1 + u2) / 3;
  const cy = (v0 + v1 + v2) / 3;

  // Inflate (perluas) koordinat clipping 0.75px keluar dari centroid
  // Ini menghilangkan 100% garis-garis mesh / celah anti-aliasing subpixel saat unduh & preview
  const expandPx = 0.75;
  const inflate = (x, y) => {
    const dx = x - cx;
    const dy = y - cy;
    const len = Math.hypot(dx, dy) || 1;
    return {
      x: x + (dx / len) * expandPx,
      y: y + (dy / len) * expandPx
    };
  };

  const p0 = inflate(u0, v0);
  const p1 = inflate(u1, v1);
  const p2 = inflate(u2, v2);

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(p0.x, p0.y);
  ctx.lineTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.closePath();
  ctx.clip();

  const delta = x0 * (y1 - y2) - x1 * (y0 - y2) + x2 * (y0 - y1);
  if (Math.abs(delta) < 0.0001) {
    ctx.restore();
    return;
  }

  const deltaA = u0 * (y1 - y2) - u1 * (y0 - y2) + u2 * (y0 - y1);
  const deltaB = x0 * (u1 - u2) - x1 * (u0 - u2) + x2 * (u0 - u1);
  const deltaC = x0 * (y1 * u2 - y2 * u1) - x1 * (y0 * u2 - y2 * u0) + x2 * (y0 * u1 - y1 * u0);
  const deltaD = v0 * (y1 - y2) - v1 * (y0 - y2) + v2 * (y0 - y1);
  const deltaE = x0 * (v1 - v2) - x1 * (v0 - v2) + x2 * (v0 - v1);
  const deltaF = x0 * (y1 * v2 - y2 * v1) - x1 * (y0 * v2 - y2 * v0) + x2 * (y0 * v1 - y1 * v0);

  const m11 = deltaA / delta;
  const m12 = deltaD / delta;
  const m21 = deltaB / delta;
  const m22 = deltaE / delta;
  const dx = deltaC / delta;
  const dy = deltaF / delta;

  ctx.transform(m11, m12, m21, m22, dx, dy);
  ctx.drawImage(img, 0, 0);
  ctx.restore();
}

