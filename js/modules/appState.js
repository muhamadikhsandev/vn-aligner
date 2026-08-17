import { defaultTransform } from './transform.js';

export function createAppState() {
  return {
    activeTab: 'upload',
    historyTick: 0,
    isPanelCollapsed: false,
    
    // Background Canvas State
    bgType: 'transparent',
    bgColor: '#ffffff',
    bgRgb: { r: 255, g: 255, b: 255 },
    presetBgColors: [
      '#ffffff', '#000000', '#0f172a', '#020617', 
      '#00ff00', '#0000ff', '#ff007f', '#f59e0b', 
      '#8b5cf6', '#06b6d4', '#ec4899', '#10b981', 
      '#64748b', '#fef3c7'
    ],
    bgImgObj: null,
    bgFileName: 'Upload Gambar BG',

    // Layer Order Global vs Individual State
    layerMode: 'global',
    globalFaceLayerOrder: 'above',

    // Multi Body State
    bodyAssetList: [],
    activeBodyIndex: 0,
    refFileName: 'Pilih Multi Badan Acuan',
    bodyMode: 'global',
    globalBodyTransform: defaultTransform(),
    
    // Multi Face State
    faceAssetList: [],
    activeFaceIndex: 0,
    faceFileName: 'Pilih Multi Aset Wajah',
    faceMode: 'global',
    globalFaceTransform: defaultTransform(),
    
    activeTarget: 'face',
    isLocked: false,
    isSelected: true,
    
    isPlayingFace: false,
    playIntervalFace: null,

    isPlayingBody: false,
    playIntervalBody: null,

    isZipping: false,
    renderPending: false,

    // Garis Presisi & Snap Alignment State
    showGuidelines: true,
    isSnappedX: false,
    isSnappedY: false,

    // Face Shape Template State
    faceShapeTemplates: [],
    selectedTemplateId: '',
    isEditingTemplate: true,
    showTemplateOutline: true,
    showBeforeAfter: false,
    selectedContourPointIndex: 0,
    hoveredContourPointIndex: null,
    activePointIndex: null,
    newTemplateName: '',

    // Corner Handle Resizing State
    activeHandle: null,
    initialRect: null,
    initialStretchX: 100,
    initialStretchY: 100,

    // Visibilitas Overlay & Outline
    showBox: true,
    showPolygon: true,
    hideAllOverlays: false,

    // Tool Brush Hapus Canvas State
    isEraserActive: false,
    brushSize: 30,
    brushOpacity: 100,
    activePointerPos: null,

    // Mode Canvas Interaksi Khusus ('drag' | 'transform' | 'shape' | 'rotation')
    canvasInteractionMode: 'drag',
    isModeDropdownOpen: false,

    // Mode Box & Drag State
    boxLockAspect: false,
    boxAnchor: 'center',
    handleSize: 36,
    lockImagePosition: false,
    isDragEnabled: true,
    activeWarpNode: -1,

    // Canvas Size
    CANVAS_W: 600,
    CANVAS_H: 800,
    tempW: 600,
    tempH: 800,
    ratioPresets: [
      { name: '600x800', w: 600, h: 800 },
      { name: '1:1 Square', w: 1000, h: 1000 },
      { name: '9:16 Story', w: 1080, h: 1920 },
      { name: '16:9 Wide', w: 1920, h: 1080 },
      { name: '3:4 Portrait', w: 900, h: 1200 },
      { name: '4:3 Landscape', w: 1200, h: 900 }
    ],

    camZoom: 1.0,
    camZoomPercent: 100,
    camPanX: 0,
    camPanY: 0,
    isZoomDropdownOpen: false,
    zoomPresets: [
      { value: 1.0, label: '1x Full' },
      { value: 2.0, label: '2x Zoom' },
      { value: 3.0, label: '3x Zoom' },
      { value: 4.0, label: '4x Detail' }
    ],

    isDragging: false,
    dragMode: 'move',
    dragStartX: 0, dragStartY: 0,
    initialOffsetX: 0, initialOffsetY: 0,
    initialScale: 100,

    gestureHandler: null,
    
    isExportDropdownOpen: false,
    exportMode: 'merged',
    exportOptions: [
      { value: 'merged', label: '1. Full Body + Wajah (WebP)' },
      { value: 'head_only', label: '2. Wajah Transparan (WebP)' },
      { value: 'body_only', label: '3. Badan Transparan (WebP)' }
    ],

    isScopeDropdownOpen: false,
    exportScope: 'single',
    exportScopeOptions: [
      { value: 'single', label: 'Hanya Item Aktif Ini' },
      { value: 'all_faces', label: 'Semua Wajah (Badan Aktif Ini)' },
      { value: 'all_bodies', label: 'Semua Badan (Wajah Aktif Ini)' },
      { value: 'all_matrix', label: 'Semua Kombinasi Matriks (.ZIP)' }
    ]
  };
}
