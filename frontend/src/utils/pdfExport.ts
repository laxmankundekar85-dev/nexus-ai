import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import toast from 'react-hot-toast';

export function exportReportToPdf(title: string, markdownContent: string): void {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 14;
    const usableWidth = pageWidth - margin * 2;
    let y = margin;

    // Executive Top Header Banner
    doc.setFillColor(30, 58, 138); // Deep Blue
    doc.rect(0, 0, pageWidth, 18, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.text('NEXUS AI  |  AUTONOMOUS MULTI-AGENT INTELLIGENCE DOSSIER', margin, 11);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(new Date().toUTCString(), pageWidth - margin, 11, { align: 'right' });

    y = 26;

    const lines = markdownContent.split(/\r?\n/);
    let inTable = false;
    let tableHeaders: string[] = [];
    let tableRows: string[][] = [];

    const checkPageBreak = (neededHeight: number) => {
      if (y + neededHeight > pageHeight - margin - 10) {
        doc.addPage();
        y = margin + 8;
      }
    };

    const flushTable = () => {
      if (tableHeaders.length > 0 || tableRows.length > 0) {
        checkPageBreak(25);
        const autoTableFn = (autoTable as any).default || autoTable;
        autoTableFn(doc, {
          head: tableHeaders.length > 0 ? [tableHeaders] : undefined,
          body: tableRows,
          startY: y,
          margin: { left: margin, right: margin },
          styles: {
            fontSize: 7.5,
            cellPadding: 2.2,
            font: 'helvetica',
            textColor: [30, 41, 59],
            lineColor: [203, 213, 225],
            lineWidth: 0.2,
          },
          headStyles: {
            fillColor: [30, 64, 175],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
          },
          alternateRowStyles: {
            fillColor: [248, 250, 252],
          },
        });
        y = (doc as any).lastAutoTable.finalY + 6;
        tableHeaders = [];
        tableRows = [];
        inTable = false;
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const rawLine = lines[i];
      const trimmed = rawLine.trim();

      // Table Row Detection
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        const cells = trimmed
          .split('|')
          .slice(1, -1)
          .map((c) => c.trim().replace(/\*\*/g, '').replace(/`/g, ''));
        if (cells.every((c) => /^:?-+:?$/.test(c))) {
          // Separator line
          continue;
        }
        if (!inTable) {
          inTable = true;
          tableHeaders = cells;
        } else {
          tableRows.push(cells);
        }
        continue;
      } else if (inTable) {
        flushTable();
      }

      if (!trimmed) {
        y += 2.5;
        continue;
      }

      // Dividers
      if (trimmed === '---' || trimmed === '***') {
        checkPageBreak(5);
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.4);
        doc.line(margin, y, pageWidth - margin, y);
        y += 5;
        continue;
      }

      // Heading 1 (# ...)
      if (trimmed.startsWith('# ')) {
        checkPageBreak(12);
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        const text = trimmed.slice(2).replace(/\*\*/g, '').replace(/`/g, '');
        const wrapped = doc.splitTextToSize(text, usableWidth);
        doc.text(wrapped, margin, y);
        y += wrapped.length * 5.5 + 3;
        continue;
      }

      // Heading 2 (## ...)
      if (trimmed.startsWith('## ')) {
        checkPageBreak(10);
        doc.setFontSize(10.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 64, 175);
        const text = trimmed.slice(3).replace(/\*\*/g, '').replace(/`/g, '');
        const wrapped = doc.splitTextToSize(text, usableWidth);
        doc.text(wrapped, margin, y);
        y += wrapped.length * 4.8 + 2.5;
        continue;
      }

      // Heading 3 (### ...)
      if (trimmed.startsWith('### ')) {
        checkPageBreak(8);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(51, 65, 85);
        const text = trimmed.slice(4).replace(/\*\*/g, '').replace(/`/g, '');
        const wrapped = doc.splitTextToSize(text, usableWidth);
        doc.text(wrapped, margin, y);
        y += wrapped.length * 4.2 + 2;
        continue;
      }

      // Blockquote (> ...)
      if (trimmed.startsWith('> ')) {
        checkPageBreak(8);
        const text = trimmed.slice(2).replace(/\*\*/g, '').replace(/`/g, '');
        const wrapped = doc.splitTextToSize(text, usableWidth - 8);
        doc.setFillColor(241, 245, 249);
        doc.rect(margin, y - 3, usableWidth, wrapped.length * 3.8 + 4, 'F');
        doc.setDrawColor(59, 130, 246);
        doc.setLineWidth(1);
        doc.line(margin, y - 3, margin, y - 3 + wrapped.length * 3.8 + 4);
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(71, 85, 105);
        doc.text(wrapped, margin + 4, y + 1);
        y += wrapped.length * 3.8 + 5.5;
        continue;
      }

      // Bullet List (- ... or * ...)
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        checkPageBreak(5);
        const text = trimmed.slice(2).replace(/\*\*/g, '').replace(/`/g, '');
        const wrapped = doc.splitTextToSize(text, usableWidth - 6);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(30, 41, 59);
        doc.text('•', margin + 1, y);
        doc.text(wrapped, margin + 5, y);
        y += wrapped.length * 3.8 + 1.5;
        continue;
      }

      // Numbered List (1. ... or 2. ...)
      const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
      if (numMatch) {
        checkPageBreak(5);
        const num = numMatch[1] + '.';
        const text = numMatch[2].replace(/\*\*/g, '').replace(/`/g, '');
        const wrapped = doc.splitTextToSize(text, usableWidth - 7);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 64, 175);
        doc.text(num, margin, y);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(30, 41, 59);
        doc.text(wrapped, margin + 6, y);
        y += wrapped.length * 3.8 + 1.5;
        continue;
      }

      // Regular Paragraph
      const text = trimmed.replace(/\*\*/g, '').replace(/`/g, '');
      const wrapped = doc.splitTextToSize(text, usableWidth);
      checkPageBreak(wrapped.length * 3.8);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      doc.text(wrapped, margin, y);
      y += wrapped.length * 3.8 + 2;
    }

    if (inTable) {
      flushTable();
    }

    // Number pages & add bottom footer
    const totalPages = doc.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
      doc.setPage(p);
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(148, 163, 184);
      doc.text(
        'Nexus AI Autonomous Multi-Agent Operating Platform — Verified Intelligence Dossier',
        margin,
        pageHeight - 8
      );
      doc.text(`Page ${p} of ${totalPages}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
    }

    const cleanFilename = (title || 'Nexus_AI_Intelligence_Report')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .substring(0, 60);

    doc.save(`${cleanFilename}.pdf`);
    toast.success('PDF report downloaded successfully!');
  } catch (err) {
    console.error('Failed to export PDF:', err);
    toast.error('Failed to generate PDF. Falling back to print...');
    exportReportViaPrint(title, markdownContent);
  }
}

export function exportReportViaPrint(title: string, markdownContent: string): void {
  try {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Pop-up blocked. Please allow pop-ups to print/save PDF.');
      return;
    }

    const htmlContent = markdownContent
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-slate-900 mb-3 border-b pb-2">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-blue-700 mt-6 mb-2 border-b pb-1">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-base font-bold text-slate-800 mt-4 mb-2">$1</h3>')
      .replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-blue-600 bg-slate-50 p-2.5 my-2 text-xs italic text-slate-700">$1</blockquote>')
      .replace(/^\- (.*$)/gim, '<li class="text-xs text-slate-800 ml-4 list-disc my-0.5">$1</li>')
      .replace(/^\d+\.\s+(.*$)/gim, '<li class="text-xs text-slate-800 ml-4 list-decimal my-0.5">$1</li>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/`(.*?)`/gim, '<code class="bg-slate-100 px-1 py-0.5 rounded text-xs font-mono">$1</code>')
      .replace(/\n\n/gim, '<br/>');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            @page { margin: 15mm; size: A4; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              color: #0f172a;
              line-height: 1.6;
              padding: 20px;
            }
            .header-bar {
              background-color: #1e3a8a;
              color: white;
              padding: 12px 18px;
              border-radius: 6px;
              margin-bottom: 20px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .header-bar h4 { margin: 0; font-size: 13px; font-weight: bold; letter-spacing: 0.5px; }
            .header-bar span { font-size: 10px; opacity: 0.85; }
            h1 { font-size: 20px; color: #0f172a; margin-top: 15px; margin-bottom: 10px; }
            h2 { font-size: 15px; color: #1e40af; margin-top: 20px; margin-bottom: 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
            h3 { font-size: 13px; color: #334155; margin-top: 12px; margin-bottom: 6px; }
            p { font-size: 11px; margin: 6px 0; color: #334155; }
            table { width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 10px; }
            th { background-color: #1e40af; color: white; padding: 6px 8px; text-align: left; font-weight: bold; }
            td { border: 1px solid #cbd5e1; padding: 5px 8px; color: #334155; }
            tr:nth-child(even) { background-color: #f8fafc; }
            blockquote { border-left: 3px solid #3b82f6; background-color: #f1f5f9; padding: 8px 12px; margin: 10px 0; font-style: italic; font-size: 10px; }
            .footer { margin-top: 30px; border-top: 1px solid #cbd5e1; padding-top: 10px; font-size: 9px; color: #94a3b8; display: flex; justify-content: space-between; }
          </style>
        </head>
        <body>
          <div class="header-bar">
            <h4>NEXUS AI  |  AUTONOMOUS MULTI-AGENT INTELLIGENCE DOSSIER</h4>
            <span>${new Date().toUTCString()}</span>
          </div>
          <div>${htmlContent}</div>
          <div class="footer">
            <span>Nexus AI Multi-Agent Operating Platform — Verified Automated Intelligence Artifact</span>
            <span>Zero-Hallucination Grounded Dossier</span>
          </div>
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  } catch (err) {
    console.error('Print preview failed:', err);
    toast.error('Failed to open print preview');
  }
}
