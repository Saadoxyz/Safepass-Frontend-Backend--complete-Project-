// src/modules/reports/services/export.service.ts
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { Response } from 'express';

@Injectable()
export class ExportService {
  exportToPDF(visitors: any[], res: Response): void {
    const doc = new (PDFDocument as any)({ margin: 50 });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');

    res.setHeader(
      'Content-Disposition',
      `attachment; filename=visitors-report-${Date.now()}.pdf`,
    );

    doc.pipe(res);

    // Add title
    doc.fontSize(20).text('Visitor Management Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Generated on: ${new Date().toLocaleString()}`);
    doc.moveDown(2);

    // Add table headers
    const tableTop = 150;
    const col1 = 50;
    const col2 = 150;
    const col3 = 250;
    const col4 = 350;
    const col5 = 450;

    doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .text('Name', col1, tableTop)
      .text('CNIC', col2, tableTop)
      .text('Visit Date', col3, tableTop)
      .text('Host', col4, tableTop)
      .text('Status', col5, tableTop);

    doc
      .moveTo(col1, tableTop + 15)
      .lineTo(550, tableTop + 15)
      .stroke();

    // Add visitor data
    let yPosition = tableTop + 25;
    doc.font('Helvetica');

    visitors.forEach((visitor) => {
      if (yPosition > 700) {
        doc.addPage();
        yPosition = 50;
      }

      doc
        .fontSize(9)
        .text(visitor.name || 'N/A', col1, yPosition, { width: 90 })
        .text(visitor.cnic || 'N/A', col2, yPosition, { width: 90 })
        .text(
          new Date(visitor.visitDate).toLocaleDateString(),
          col3,
          yPosition,
          { width: 90 },
        )
        .text(visitor.hostId?.name || 'N/A', col4, yPosition, { width: 90 })
        .text(visitor.status, col5, yPosition, { width: 90 });

      yPosition += 25;
    });

    // Add footer
    doc
      .fontSize(8)
      .text(`Total Visitors: ${visitors.length}`, 50, doc.page.height - 50, {
        align: 'center',
      });

    doc.end();
  }

  exportToExcel(visitors: any[], res: Response): void {
    // Create CSV format (Excel can open this)
    let csv = 'Name,CNIC,Visit Date,Host,Company,Status\n';

    visitors.forEach((visitor) => {
      csv += `"${visitor.name || 'N/A'}","${visitor.cnic || 'N/A'}","${new Date(visitor.visitDate).toLocaleString()}","${visitor.hostId?.name || 'N/A'}","${visitor.company || 'N/A'}","${visitor.status}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=visitors-report-${Date.now()}.csv`,
    );
    res.send(csv);
  }
}
