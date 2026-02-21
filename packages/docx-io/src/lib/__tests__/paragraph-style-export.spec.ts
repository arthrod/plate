import { describe, expect, it } from 'bun:test';
import JSZip from 'jszip';

import { htmlToDocxBlob } from '../exportDocx';

async function loadZipFromBlob(blob: Blob): Promise<JSZip> {
  const arrayBuffer = await blob.arrayBuffer();
  return JSZip.loadAsync(arrayBuffer);
}

describe('Paragraph style export', () => {
  it('exports paragraph spacing, indentation, hanging indent and border styles', async () => {
    const html =
      '<p style="margin-top: 12pt; margin-bottom: 6pt; margin-left: 36pt; margin-right: 18pt; text-indent: -12pt; border-left: 1pt solid #ff0000;">Styled paragraph</p>';

    const blob = await htmlToDocxBlob(html);
    const zip = await loadZipFromBlob(blob);
    const docXml = await zip.file('word/document.xml')!.async('string');

    expect(docXml).toMatch(/<w:spacing[^>]*w:before="240"[^>]*w:after="120"/);
    expect(docXml).toMatch(
      /<w:ind[^>]*w:left="720"[^>]*w:right="360"[^>]*w:hanging="240"/
    );
    expect(docXml).toMatch(
      /<w:left[^>]*w:val="single"[^>]*w:sz="8"[^>]*w:color="FF0000"/
    );
  });

  it('exports positive text-indent as firstLine indentation', async () => {
    const html = '<p style="text-indent: 12pt;">Styled paragraph</p>';

    const blob = await htmlToDocxBlob(html);
    const zip = await loadZipFromBlob(blob);
    const docXml = await zip.file('word/document.xml')!.async('string');

    expect(docXml).toMatch(/<w:ind[^>]*w:firstLine="240"/);
  });
});
