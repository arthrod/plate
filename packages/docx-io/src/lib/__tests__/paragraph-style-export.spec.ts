import { describe, expect, it } from 'bun:test';
import JSZip from 'jszip';

import { htmlToDocxBlob } from '../exportDocx';
import { mammoth } from '../importDocx';

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

  it('reimports paragraph and run styles after export', async () => {
    const html =
      '<p style="margin-top: 12pt; margin-bottom: 6pt; margin-left: 36pt; margin-right: 18pt; text-indent: -12pt; border-left: 1pt solid #ff0000;"><span style="color: #345A8A; font-size: 14pt; font-family: Calibri;">Styled paragraph</span></p>';

    const blob = await htmlToDocxBlob(html);
    const arrayBuffer = await blob.arrayBuffer();
    const result = await mammoth.convertToHtml(
      { arrayBuffer },
      { styleMap: ['comment-reference => sup'] }
    );

    expect(result.value).toContain('margin-top: 12pt');
    expect(result.value).toContain('margin-bottom: 6pt');
    expect(result.value).toContain('margin-left: 36pt');
    expect(result.value).toContain('margin-right: 18pt');
    expect(result.value).toContain('text-indent: -12pt');
    expect(result.value).toContain('border-left: 1pt solid #FF0000');
    expect(result.value).toContain('color: #345A8A');
    expect(result.value).toContain('font-size: 14pt');
    expect(result.value).toContain('font-family: Calibri');
  });
});
