// @ts-nocheck
/* eslint-disable no-magic-numbers -- position of text */
// Ensure the PDFs folder exists (optional)
import fs from 'fs';
import { jsPDF as JsPDF } from 'jspdf';
import path from 'path';
import { fileURLToPath } from 'url';

import { OrderEntity } from '../../order/enttities/order.entity.js';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

export class OrderPdfService {
  static generateOrderPdf(order: OrderEntity): Buffer {
    const doc = new JsPDF();

    // Header
    doc.setFontSize(18);
    doc.text('Order Invoice', 105, 20, { align: 'center' });

    // Order Details
    doc.setFontSize(12);
    doc.text(`Order ID: ${order.id}`, 10, 40);
    doc.text(`Order Date: ${order.createdAt.toISOString()}`, 10, 50);
    doc.text(`Customer ID: ${order.userId}`, 10, 60);

    // Table Header
    doc.setFontSize(14);
    doc.text('Product Name', 10, 80);
    doc.text('Quantity', 100, 80);
    doc.text('Price', 140, 80);
    doc.text('Total', 180, 80);

    let yPosition = 90;
    let grandTotal = 0;

    // Order Items
    order.orderItems.forEach((item) => {
      const productName = item.product?.name || 'Unknown Product';
      const { quantity } = item;
      const price = item.product?.price || 0;
      const total = quantity * price;

      grandTotal += total;

      doc.setFontSize(12);
      doc.text(productName, 10, yPosition);
      doc.text(quantity.toString(), 100, yPosition, { align: 'right' });
      doc.text(`$${price.toFixed(2)}`, 140, yPosition, { align: 'right' });
      doc.text(`$${total.toFixed(2)}`, 180, yPosition, { align: 'right' });

      yPosition += 10;
    });

    // Grand Total
    doc.setFontSize(14);
    yPosition += 10;
    doc.text('Grand Total:', 140, yPosition, { align: 'right' });
    doc.text(`$${grandTotal.toFixed(2)}`, 180, yPosition, { align: 'right' });

    // Footer
    yPosition += 20;
    doc.setFontSize(10);
    doc.text('Thank you for your purchase!', 105, yPosition, {
      align: 'center',
    });

    // Get the root directory (adjust as per your folder structure)
    const rootDir = path.resolve(__dirname, '../../../..');

    // Path to the public folder
    const publicFolder = path.join(rootDir, 'public');

    // Path to the PDFs folder inside the public directory
    const pdfFolder = path.join(publicFolder, 'pdf');

    if (!fs.existsSync(pdfFolder)) {
      fs.mkdirSync(pdfFolder, { recursive: true });
    }

    // Example usage: full path for a specific PDF
    const filename = `${order.id}.pdf`;

    const pdfFilePath = path.join(pdfFolder, filename);

    console.log('PDF will be saved at:', pdfFilePath);

    doc.save(pdfFilePath);

    const publicPath = pdfFilePath.split('/public')[1] as string;

    // return publicPath;
    // Generate the PDF as a Buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

    return pdfBuffer;
  }
}
