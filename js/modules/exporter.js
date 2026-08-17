import { renderItemToCanvas } from './renderer.js';

export function downloadActiveItem(appState) {
  let currentFace = appState.faceAssetList[appState.activeFaceIndex] || null;
  let currentBody = appState.bodyAssetList[appState.activeBodyIndex] || null;

  if (!currentFace && !currentBody) {
    alert('Upload aset terlebih dahulu!');
    return;
  }

  const canvas = renderItemToCanvas(currentFace, currentBody, appState);
  const link = document.createElement('a');
  link.download = `export-${Date.now()}-${canvas.width}x${canvas.height}.webp`;
  link.href = canvas.toDataURL('image/webp', 0.85);
  link.click();
}

export async function downloadBatchZip(appState, setZippingStatus) {
  setZippingStatus(true);

  try {
    const zip = new JSZip();
    const currentBody = appState.bodyAssetList[appState.activeBodyIndex] || null;
    const currentFace = appState.faceAssetList[appState.activeFaceIndex] || null;

    let queue = [];

    if (appState.exportScope === 'all_faces') {
      queue = appState.faceAssetList.map((face, idx) => ({ 
        face, 
        body: currentBody, 
        name: `face_${idx + 1}_${face.name}` 
      }));
    } else if (appState.exportScope === 'all_bodies') {
      queue = appState.bodyAssetList.map((body, idx) => ({ 
        face: currentFace, 
        body, 
        name: `body_${idx + 1}_${body.name}` 
      }));
    } else if (appState.exportScope === 'all_matrix') {
      appState.bodyAssetList.forEach((body, bIdx) => {
        appState.faceAssetList.forEach((face, fIdx) => {
          queue.push({ 
            face, 
            body, 
            name: `matrix_b${bIdx + 1}_f${fIdx + 1}` 
          });
        });
      });
    }

    const promises = queue.map((item) => {
      return new Promise((resolve) => {
        const canvas = renderItemToCanvas(item.face, item.body, appState);
        canvas.toBlob((blob) => {
          zip.file(`${item.name}_${appState.exportMode}.webp`, blob);
          resolve();
        }, 'image/webp', 0.85);
      });
    });

    await Promise.all(promises);
    const zipBlob = await zip.generateAsync({ type: "blob" });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(zipBlob);
    link.download = `vn-aligner-export-${Date.now()}.zip`;
    link.click();
  } catch (err) {
    alert("Error Export Zip: " + err.message);
  } finally {
    setZippingStatus(false);
  }
}
