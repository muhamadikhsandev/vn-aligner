/**
 * Module Gesture Multi-Touch (Pinch-to-Zoom & Dual Finger Pan)
 * Menangani gesture 2 jari di layar sentuh secara real-time.
 */

export class TouchGestureHandler {
  constructor(options = {}) {
    this.onScaleChange = options.onScaleChange || (() => {});
    this.onMoveChange = options.onMoveChange || (() => {});
    this.onGestureStart = options.onGestureStart || (() => {});
    this.onGestureEnd = options.onGestureEnd || (() => {});

    this.isMultiTouch = false;
    this.initialDistance = 0;
    this.initialScale = 100;
    this.initialMidpoint = { x: 0, y: 0 };
    this.initialOffsetX = 0;
    this.initialOffsetY = 0;
  }

  getDistance(t1, t2) {
    const dx = t2.clientX - t1.clientX;
    const dy = t2.clientY - t1.clientY;
    return Math.hypot(dx, dy);
  }

  getMidpoint(t1, t2) {
    return {
      x: (t1.clientX + t2.clientX) / 2,
      y: (t1.clientY + t2.clientY) / 2
    };
  }

  handleTouchStart(e, currentScale, currentOffsetX, currentOffsetY) {
    if (e.touches && e.touches.length === 2) {
      this.isMultiTouch = true;
      this.initialDistance = this.getDistance(e.touches[0], e.touches[1]);
      this.initialScale = currentScale || 100;
      this.initialMidpoint = this.getMidpoint(e.touches[0], e.touches[1]);
      this.initialOffsetX = currentOffsetX || 0;
      this.initialOffsetY = currentOffsetY || 0;
      this.onGestureStart();
      return true;
    }
    this.isMultiTouch = false;
    return false;
  }

  handleTouchMove(e, getCanvasCoordsFn) {
    if (!this.isMultiTouch || !e.touches || e.touches.length !== 2) {
      return false;
    }

    const currentDist = this.getDistance(e.touches[0], e.touches[1]);
    if (this.initialDistance > 0) {
      const ratio = currentDist / this.initialDistance;
      const newScale = Math.max(10, Math.min(400, Math.round(this.initialScale * ratio)));
      
      // Hitung pergeseran midpoint dua jari
      const currentMidpoint = this.getMidpoint(e.touches[0], e.touches[1]);
      const dx = (currentMidpoint.x - this.initialMidpoint.x);
      const dy = (currentMidpoint.y - this.initialMidpoint.y);

      this.onScaleChange(newScale);
      if (dx !== 0 || dy !== 0) {
        this.onMoveChange(this.initialOffsetX + dx, this.initialOffsetY + dy);
      }
    }
    return true;
  }

  handleTouchEnd(e) {
    if (this.isMultiTouch && (!e.touches || e.touches.length < 2)) {
      this.isMultiTouch = false;
      this.initialDistance = 0;
      this.onGestureEnd();
      return true;
    }
    return false;
  }
}
