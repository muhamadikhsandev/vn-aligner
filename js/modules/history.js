export class HistoryManager {
  constructor(maxHistory = 50) {
    this.historyStack = [];
    this.redoStack = [];
    this.maxHistory = maxHistory;
    this.isInternalChange = false;
  }

  canUndo() {
    return this.historyStack.length > 1;
  }

  canRedo() {
    return this.redoStack.length > 0;
  }

  pushState(snapshotJson) {
    if (this.isInternalChange) return;
    if (this.historyStack.length > 0 && this.historyStack[this.historyStack.length - 1] === snapshotJson) {
      return;
    }
    this.historyStack.push(snapshotJson);
    if (this.historyStack.length > this.maxHistory) {
      this.historyStack.shift();
    }
    this.redoStack = [];
  }

  undo() {
    if (!this.canUndo()) return null;
    const current = this.historyStack.pop();
    this.redoStack.push(current);
    return this.historyStack[this.historyStack.length - 1];
  }

  redo() {
    if (!this.canRedo()) return null;
    const next = this.redoStack.pop();
    this.historyStack.push(next);
    return next;
  }

  clear() {
    this.historyStack = [];
    this.redoStack = [];
  }
}
