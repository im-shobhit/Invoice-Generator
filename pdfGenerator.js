// pdfGenerator.js
function generatePDF(invoiceData) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Title
  doc.setFontSize(18);
  doc.text("INVOICE", 14, 20);

  // Client & Invoice Details
  doc.setFontSize(11);
  doc.text(`Client: ${invoiceData.clientName || "N/A"}`, 14, 30);
  doc.text(`Invoice #: ${invoiceData.invoiceNumber}`, 150, 20);
  doc.text(`Date: ${invoiceData.date}`, 150, 28);
  doc.text(`Due Date: ${invoiceData.dueDate}`, 150, 36);

  // Table Data
  let tableData = invoiceData.items.map((item, index) => [
    index + 1,
    item.desc || "—",
    item.qty,
    `${invoiceData.currency}${item.price.toFixed(2)}`,
    `${invoiceData.currency}${(item.qty * item.price).toFixed(2)}`
  ]);

  // Table with Grid Lines
  doc.autoTable({
    startY: 45,
    head: [["#", "Description", "Qty", "Price", "Total"]],
    body: tableData,
    theme: "grid", // ✅ grid adds borders around cells
    headStyles: { fillColor: [41, 128, 185] }, // nice blue header
    styles: { halign: "center", valign: "middle" },
    columnStyles: {
      1: { halign: "left" } // Description aligned left
    }
  });

  // Calculate Totals
  let subtotal = invoiceData.items.reduce((acc, item) => acc + item.qty * item.price, 0);
  let taxAmount = (subtotal * invoiceData.taxRate) / 100;
  let grandTotal = subtotal + taxAmount;

  // Totals Section with Grid Look
  let finalY = doc.lastAutoTable.finalY + 10;
  doc.autoTable({
    startY: finalY,
    theme: "grid",
    body: [
      ["Subtotal", `${invoiceData.currency}${subtotal.toFixed(2)}`],
      [`Tax (${invoiceData.taxRate}%)`, `${invoiceData.currency}${taxAmount.toFixed(2)}`],
      ["Grand Total", `${invoiceData.currency}${grandTotal.toFixed(2)}`]
    ],
    styles: { halign: "right" },
    columnStyles: {
      0: { halign: "left" },
      1: { halign: "right" }
    }
  });

  // Save PDF
  doc.save(`Invoice_${invoiceData.invoiceNumber}.pdf`);
}
