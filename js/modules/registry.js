export const FaceRegistry = new Map();

export function createThumbnail(img, nw, nh) {
  const thumbCanvas = document.createElement('canvas');
  thumbCanvas.width = 80;
  thumbCanvas.height = 80;
  const tCtx = thumbCanvas.getContext('2d');
  const scale = Math.max(80 / nw, 80 / nh);
  tCtx.drawImage(img, (nw - (80 / scale)) / 2, (nh - (80 / scale)) / 2, 80 / scale, 80 / scale, 0, 0, 80, 80);
  return thumbCanvas.toDataURL('image/webp', 0.8);
}

export function registerAsset(id, src, img, w, h) {
  FaceRegistry.set(id, { src, img, w, h });
}

export function getAsset(id) {
  return FaceRegistry.get(id);
}
