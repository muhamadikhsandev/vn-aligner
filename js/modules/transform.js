import { getDefaultContourPoints } from './faceReshape.js';

export const defaultTransform = () => ({
  scale: 100,
  stretchX: 100, // 50%..200% (Skala Kiri-Kanan / Lebar)
  stretchY: 100, // 50%..200% (Skala Atas-Bawah / Tinggi)
  offsetX: 0,
  offsetY: 0,
  topPadding: 0,
  rotation: 0,   // -180..180 derajat
  flipH: false,  // Cermin Horisontal
  flipV: false,  // Cermin Vertikal
  faceOpacity: 1.0,
  onionOpacity: 1.0,
  layerOrder: 'above', // 'above' | 'below'
  
  // Goresan Brush Hapus Area
  eraseStrokes: [],

  // Reshape Wajah Parametrik & Template
  reshape: defaultFaceShape()
});

export function defaultFaceShape() {
  return {
    useTemplate: false,
    templatePoints: getDefaultContourPoints(),
    vShape: 0,       // -300..300 (Rahang V-Shape)
    cheekbones: 0,   // -300..300 (Pipi)
    forehead: 0,     // -300..300 (Dahi)
    chinLength: 0,   // -300..300 (Panjang Dagu)

    // Alis (Eyebrows)
    eyebrowY: 0,     // -100..100 (Tinggi Alis Y)
    eyebrowAngle: 0, // -100..100 (Kemiringan Alis)

    // Mata (Eyes)
    eyeScale: 100,   // 10..400% (Ukuran Mata)
    eyeDistance: 0,  // -100..100 (Jarak Antar Mata)
    eyeY: 0,         // -100..100 (Tinggi Mata Y)

    // Hidung (Nose)
    noseWidth: 100,  // 10..400% (Lebar Hidung)
    noseY: 0,        // -100..100 (Tinggi Hidung Y)

    // Mulut (Mouth)
    mouthWidth: 100, // 10..400% (Lebar Mulut)
    mouthScale: 100, // 10..400% (Ukuran Mulut)
    mouthY: 0,       // -100..100 (Tinggi Mulut Y)

    stretchX: 100,   // Peregangan X
    stretchY: 100    // Peregangan Y
  };
}

export function getGCD(a, b) {
  return b === 0 ? a : getGCD(b, a % b);
}

export function calculateRatioText(w, h) {
  if (!w || !h) return 'N/A';
  const gcd = getGCD(w, h);
  const rw = w / gcd;
  const rh = h / gcd;
  if (rw > 50 || rh > 50) {
    return (w / h).toFixed(2) + ':1';
  }
  return `${rw}:${rh}`;
}

export function getFaceDimensions(img, transform, canvasW, canvasH) {
  const w = img.naturalWidth || canvasW;
  const h = img.naturalHeight || canvasH;
  const baseScale = Math.min(canvasW / w, canvasH / h);
  const scaleMult = (transform.scale / 100);
  
  const sX = transform.stretchX !== undefined ? transform.stretchX : (transform.reshape?.stretchX || 100);
  const sY = transform.stretchY !== undefined ? transform.stretchY : (transform.reshape?.stretchY || 100);
  
  const stretchXMult = sX / 100;
  const stretchYMult = sY / 100;
  
  return { 
    w: w * baseScale * scaleMult * stretchXMult, 
    h: h * baseScale * scaleMult * stretchYMult 
  };
}

export function getBodyDimensions(img, transform, canvasW, canvasH) {
  const w = img.naturalWidth || canvasW;
  const h = img.naturalHeight || canvasH;
  const baseScale = Math.min(canvasW / w, canvasH / h);
  return { 
    w: w * baseScale * (transform.scale / 100), 
    h: h * baseScale * (transform.scale / 100) 
  };
}
