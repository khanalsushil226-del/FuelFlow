// ==========================================
// FuelFlow Sales Module
// Part 1/4
// ==========================================



// ==============================
// Select Elements
// ==============================

const customerName = document.getElementById("customerName");
const vehicleNumber = document.getElementById("vehicleNumber");
const fuelType = document.getElementById("fuelType");
const quantity = document.getElementById("quantity");
const rate = document.getElementById("rate");
const payment = document.getElementById("payment");

const generateBtn = document.querySelector(".save-btn");
const clearBtn = document.querySelector(".cancel-btn");

const salesTableBody = document.getElementById("salesTableBody");

const receiptContent = document.getElementById("receiptContent");

const searchInput = document.getElementById("searchSales");

const totalSalesElement = document.getElementById("totalSales");
const transactionElement = document.getElementById("totalTransactions");
const fuelSoldElement = document.getElementById("totalFuel");

const printBtn = document.getElementById("printReceipt");
const downloadPdfBtn = document.getElementById("downloadPdf");



// ==============================
// Local Database
// ==============================

let salesData =
JSON.parse(localStorage.getItem("sales")) || [];

let currentReceipt = null;



// ==============================
// Generate Invoice Number
// ==============================

function generateInvoice(){

    let lastInvoice =
    localStorage.getItem("lastInvoice");

    if(lastInvoice === null){

        lastInvoice = 1000;

    }

    const newInvoice =
    Number(lastInvoice) + 1;

    localStorage.setItem(
        "lastInvoice",
        newInvoice
    );

    return "INV-" + newInvoice;

}



// ==============================
// Save Data
// ==============================

function saveSales(){

    localStorage.setItem(

        "sales",

        JSON.stringify(salesData)

    );

}



// ==============================
// Display Sales Table
// ==============================

function displaySales(data){

    salesTableBody.innerHTML = "";

    if(data.length === 0){

        salesTableBody.innerHTML = `

        <tr>

            <td colspan="8">

                No sales recorded yet.

            </td>

        </tr>

        `;

        return;

    }

    data.forEach((sale)=>{

        salesTableBody.innerHTML += `

        <tr>

            <td>${sale.invoice}</td>

            <td>${sale.customer}</td>

            <td>${sale.vehicle}</td>

            <td>${sale.fuel}</td>

            <td>${sale.quantity} L</td>

            <td>Rs. ${sale.amount}</td>

            <td>${sale.payment}</td>

            <td>

                <div class="action-buttons">

                    <button
                        class="view-btn"
                        onclick="viewBill('${sale.invoice}')">

                        <i class="fa-solid fa-eye"></i>

                    </button>

                    <button
                        class="print-btn"
                        onclick="printBill('${sale.invoice}')">

                        <i class="fa-solid fa-print"></i>

                    </button>

                </div>

            </td>

        </tr>

        `;

    });

}
// ==========================================
// Part 2/4
// Receipt + Summary + Load Sales
// ==========================================



// ==============================
// Generate Receipt
// ==============================

function generateReceipt(sale){

    currentReceipt = sale;

    receiptContent.innerHTML = `

        <div style="text-align:center;">

            <h2>FuelFlow</h2>

            <p>Smart Petrol Pump</p>

            <p>Management System</p>

        </div>

        <hr>

        <p><strong>Invoice :</strong> ${sale.invoice}</p>

        <p><strong>Date :</strong> ${sale.date}</p>

        <hr>

        <p><strong>Customer :</strong> ${sale.customer}</p>

        <p><strong>Vehicle :</strong> ${sale.vehicle}</p>

        <p><strong>Fuel :</strong> ${sale.fuel}</p>

        <p><strong>Quantity :</strong> ${sale.quantity} L</p>

        <p><strong>Rate :</strong> Rs. ${sale.rate}</p>

        <p><strong>Payment :</strong> ${sale.payment}</p>

        <hr>

        <h3 style="text-align:center;">

            TOTAL : Rs. ${sale.amount}

        </h3>

        <hr>

        <p style="text-align:center;">

            Thank You! Visit Again

        </p>

    `;

}



// ==============================
// Update Summary
// ==============================

function updateSummary(){

    let totalSales = 0;

    let totalFuel = 0;

    let totalTransactions = salesData.length;

    salesData.forEach((sale)=>{

        totalSales += Number(sale.amount);

        totalFuel += Number(sale.quantity);

    });

    totalSalesElement.textContent =
    "Rs. " + totalSales;

    transactionElement.textContent =
    totalTransactions;

    fuelSoldElement.textContent =
    totalFuel + " L";

}



// ==============================
// Load Sales
// ==============================

function loadSales(){

    displaySales(salesData);

    updateSummary();

}
// ==========================================
// Part 3/4
// Generate Bill
// ==========================================



// ==============================
// Generate Bill
// ==============================

generateBtn.addEventListener("click",(e)=>{

    e.preventDefault();

    // Validation

    if(

        customerName.value.trim()==="" ||

        vehicleNumber.value.trim()==="" ||

        quantity.value.trim()==="" ||

        rate.value.trim()===""

    ){

        alert("Please fill all required fields.");

        return;

    }


    const litres = Number(quantity.value);

    const price = Number(rate.value);


    const sale = {

        invoice : generateInvoice(),

        customer : customerName.value.trim(),

        vehicle : vehicleNumber.value.trim(),

        fuel : fuelType.value,

        quantity : litres,

        rate : price,

        amount : litres * price,

        payment : payment.value,

        date : new Date().toLocaleString()

    };


    // Save Sale

    salesData.push(sale);

    saveSales();


    // Refresh Table

    displaySales(salesData);


    // Update Summary

    updateSummary();


    // Show Receipt

    generateReceipt(sale);


    // Clear Form

    customerName.value = "";

    vehicleNumber.value = "";

    fuelType.selectedIndex = 0;

    quantity.value = "";

    rate.value = "";

    payment.selectedIndex = 0;

});



// ==============================
// Clear Form
// ==============================

clearBtn.addEventListener("click",(e)=>{

    e.preventDefault();

    customerName.value = "";

    vehicleNumber.value = "";

    fuelType.selectedIndex = 0;

    quantity.value = "";

    rate.value = "";

    payment.selectedIndex = 0;

});
// ==========================================
// Part 4/4
// Search, View, Print, PDF & Page Load
// ==========================================



// ==============================
// Search Sales
// ==============================

if(searchInput){

    searchInput.addEventListener("input",()=>{

        const keyword = searchInput.value
        .toLowerCase()
        .trim();

        const filteredSales = salesData.filter((sale)=>{

            return(

                sale.invoice.toLowerCase().includes(keyword) ||

                sale.customer.toLowerCase().includes(keyword) ||

                sale.vehicle.toLowerCase().includes(keyword)

            );

        });

        displaySales(filteredSales);

    });

}



// ==============================
// View Previous Bill
// ==============================

function viewBill(invoice){

    const sale = salesData.find(

        item => item.invoice === invoice

    );

    if(!sale){

        alert("Bill not found.");

        return;

    }

    generateReceipt(sale);

}



// ==============================
// Print Previous Bill
// ==============================

function printBill(invoice){

    const sale = salesData.find(

        item => item.invoice === invoice

    );

    if(!sale){

        alert("Bill not found.");

        return;

    }

    generateReceipt(sale);

    window.print();

}



// ==============================
// Print Current Receipt
// ==============================

if(printBtn){

    printBtn.addEventListener("click",()=>{

        if(currentReceipt){

            window.print();

        }else{

            alert("Please generate or view a receipt first.");

        }

    });

}



// ==============================
// Download Receipt PDF
// ==============================

if(downloadPdfBtn){

    downloadPdfBtn.addEventListener("click",()=>{

        if(!currentReceipt){

            alert("Please generate or view a receipt first.");

            return;

        }

        const { jsPDF } = window.jspdf;

        const doc = new jsPDF({

            orientation:"portrait",

            unit:"mm",

            format:[80,160]

        });

        let y = 10;

        doc.setFont("courier","bold");
        doc.setFontSize(16);
        doc.text("FuelFlow",40,y);

        y += 7;

        doc.setFont("courier","normal");
        doc.setFontSize(9);

        doc.text("Smart Petrol Pump",20,y);

        y += 5;

        doc.text("Management System",18,y);

        y += 8;

        doc.line(5,y,75,y);

        y += 8;

        doc.text(`Invoice : ${currentReceipt.invoice}`,5,y);

        y += 6;

        doc.text(`Date : ${currentReceipt.date}`,5,y);

        y += 8;

        doc.text(`Customer : ${currentReceipt.customer}`,5,y);

        y += 6;

        doc.text(`Vehicle : ${currentReceipt.vehicle}`,5,y);

        y += 6;

        doc.text(`Fuel : ${currentReceipt.fuel}`,5,y);

        y += 6;

        doc.text(`Quantity : ${currentReceipt.quantity} L`,5,y);

        y += 6;

        doc.text(`Rate : Rs. ${currentReceipt.rate}`,5,y);

        y += 6;

        doc.text(`Payment : ${currentReceipt.payment}`,5,y);

        y += 8;

        doc.line(5,y,75,y);

        y += 8;

        doc.setFont("courier","bold");
        doc.setFontSize(12);

        doc.text(`TOTAL : Rs. ${currentReceipt.amount}`,5,y);

        y += 10;

        doc.setFontSize(9);

        doc.text("Thank You! Visit Again",18,y);

        doc.save(`Receipt_${currentReceipt.invoice}.pdf`);

    });

}



// ==============================
// Initial Page Load
// ==============================

loadSales();

updateSummary();