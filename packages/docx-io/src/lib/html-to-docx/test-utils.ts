import JSZip from 'jszip';

export async function loadZipFromBlob(blob: Blob): Promise<JSZip> {
  const zip = new JSZip();
  return zip.loadAsync(await blob.arrayBuffer());
}
