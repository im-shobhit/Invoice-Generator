// Example Product Database (barcode -> product info)
const productDB = {
  "8901234567890": { name: "Pepsi 500ml", price: 1.5 },
  "8909876543210": { name: "Lays Chips", price: 2.0 },
  "9780140449136": { name: "Book: The Odyssey", price: 12.5 }
};

// Add new row in invoice
function addRow() {
  let table = document.getElementById("invoiceTable").getElementsByTagName('tbody')[0];
  let newRow = table.insertRow();
  newRow.innerHTML = `
    <td style="display:flex; gap:5px; align-items:center; justify-content:center;">
      <input type="text" placeholder="Item name" style="flex:1;">
      <button onclick="startRowScanner(this)" title="Scan Barcode">📷</button>
    </td>
    <td><input type="number" value="1" oninput="updateInvoice()"></td>
    <td><input type="number" value="0" oninput="updateInvoice()"></td>
    <td class="rowTotal">$0.00</td>
    <td><button onclick="removeRow(this)">❌</button></td>
  `;
  updateInvoice();
}

// Remove row
function removeRow(button) {
  button.parentElement.parentElement.remove();
  updateInvoice();
}

// Update invoice totals
function updateInvoice() {
  let table = document.getElementById("invoiceTable").getElementsByTagName('tbody')[0];
  let rows = table.getElementsByTagName('tr');
  let subtotal = 0;
  let currency = document.getElementById("currency").value;

  for (let row of rows) {
    let qty = parseFloat(row.cells[1].getElementsByTagName("input")[0].value) || 0;
    let price = parseFloat(row.cells[2].getElementsByTagName("input")[0].value) || 0;
    let total = qty * price;
    row.cells[3].innerText = currency + total.toFixed(2);
    subtotal += total;
  }

  let taxRate = parseFloat(document.getElementById("taxRate").value) || 0;
  let taxAmount = (subtotal * taxRate) / 100;
  let grandTotal = subtotal + taxAmount;

  document.getElementById("subtotal").innerText = "Subtotal: " + currency + subtotal.toFixed(2);
  document.getElementById("taxAmount").innerText = "Tax: " + currency + taxAmount.toFixed(2);
  document.getElementById("total").innerText = "Grand Total: " + currency + grandTotal.toFixed(2);
}

// -------------------- SCANNER -------------------- //
let html5QrCode = null;

// Open scanner for a specific row
function startRowScanner(button) {
  let row = button.closest("tr");
  let inputBox = row.cells[0].querySelector("input");

  if (!html5QrCode) {
    html5QrCode = new Html5Qrcode("reader");
  }

  document.getElementById("scanner").style.display = "block";

  html5QrCode.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: { width: 250, height: 150 } },
    (decodedText) => {
      let product = productDB[decodedText];
      if (product) {
        inputBox.value = product.name;
        row.cells[2].querySelector("input").value = product.price;
        updateInvoice();
      } else {
        alert("Product not found for barcode: " + decodedText);
      }
      // ✅ scanner keeps running until user stops manually
    },
    () => {}
  );
}

// Stop scanner manually
function stopScanner() {
  if (html5QrCode) {
    html5QrCode.stop().then(() => {
      document.getElementById("scanner").style.display = "none";
    }).catch(err => console.error("Stop failed", err));
  }
}

// Manual barcode input (prompt)
function manualBarcodeInput(button) {
  let row = button.closest("tr");
  let inputBox = row.cells[0].querySelector("input");
  let barcode = prompt("Enter barcode:");
  if (barcode) {
    let product = productDB[barcode];
    if (product) {
      inputBox.value = product.name;
      row.cells[2].querySelector("input").value = product.price;
      updateInvoice();
    } else {
      alert("Product not found for barcode: " + barcode);
    }
  }
}
