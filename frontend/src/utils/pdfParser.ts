import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';

// Use CDN worker matching installed version to avoid Vite bundling worker issues
if (typeof window !== 'undefined' && 'GlobalWorkerOptions' in pdfjsLib) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

export async function extractPdfText(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      useSystemFonts: true,
      isEvalSupported: false,
    });

    const pdfDoc = await loadingTask.promise;
    let fullText = '';

    for (let i = 1; i <= pdfDoc.numPages; i++) {
      const page = await pdfDoc.getPage(i);
      const textContent = await page.getTextContent();
      const pageStrings = textContent.items
        .map((item: any) => ('str' in item ? item.str : ''))
        .filter(Boolean);

      if (pageStrings.length > 0) {
        fullText += `=== Page ${i} ===\n` + pageStrings.join(' ') + '\n\n';
      }
    }

    return fullText.trim();
  } catch (err) {
    console.warn('PDF extraction notice:', err);
    return '';
  }
}
