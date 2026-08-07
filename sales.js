// ==========================================
// FuelFlow Sales Module
// Part 1
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



// ==============================
// Database
// ==============================

let salesData = JSON.parse(
    localStorage.getItem("sales")
) || [];




// ==============================
// Generate Invoice Number
// ==============================

function generateInvoice(){

    let lastInvoice =
    localStorage.getItem("lastInvoice");

    if(lastInvoice === null){

        lastInvoice = 1000;

    }

    let newInvoice =
    Number(lastInvoice) + 1;

    localStorage.setItem(
        "lastInvoice",
        newInvoice
    );

    return "INV-" + newInvoice;

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

                No sales found.

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

                <button
                    class="view-btn"
                    onclick="viewBill('${sale.invoice}')">

                    View Bill

                </button>

            </td>

        </tr>

        `;

    });

}
// ==============================
// Generate Receipt
// ==============================

function generateReceipt(sale){

    receiptContent.innerHTML = `

        <h3 style="text-align:center;">FuelFlow</h3>

        <p>Invoice : ${sale.invoice}</p>

        <p>Date : ${sale.date}</p>

        <hr>

        <p>Customer : ${sale.customer}</p>

        <p>Vehicle : ${sale.vehicle}</p>

        <p>Fuel : ${sale.fuel}</p>

        <p>Quantity : ${sale.quantity} L</p>

        <p>Rate : Rs. ${sale.rate}</p>

        <p>Payment : ${sale.payment}</p>

        <hr>

        <h3>Total : Rs. ${sale.amount}</h3>

    `;

}



// ==============================
// Update Summary
// ==============================

function updateSummary(){

    let total = 0;
    let fuel = 0;

    salesData.forEach((sale)=>{

        total += Number(sale.amount);
        fuel += Number(sale.quantity);

    });

    totalSalesElement.textContent = "Rs. " + total;
    transactionElement.textContent = salesData.length;
    fuelSoldElement.textContent = fuel + " L";

}



// ==============================
// Load Sales
// ==============================

function loadSales(){

    displaySales(salesData);

    updateSummary();

}



// ==============================
// Generate Bill
// ==============================

generateBtn.addEventListener("click",(e)=>{

    e.preventDefault();

    if(

        customerName.value.trim()==="" ||

        vehicleNumber.value.trim()==="" ||

        quantity.value.trim()===""

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



    salesData.push(sale);

    localStorage.setItem(

        "sales",

        JSON.stringify(salesData)

    );



    displaySales(salesData);

    updateSummary();

    generateReceipt(sale);



    customerName.value = "";

    vehicleNumber.value = "";

    quantity.value = "";

    rate.value = "";

});
// ==============================
// Search Sales
// ==============================

if(searchInput){

    searchInput.addEventListener("input",()=>{

        const keyword = searchInput.value.toLowerCase().trim();

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

    const sale = salesData.find((item)=>item.invoice===invoice);

    if(!sale){

        alert("Bill not found.");

        return;

    }

    generateReceipt(sale);

}



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



// ==============================
// Print Receipt
// ==============================

if(printBtn){

    printBtn.addEventListener("click",()=>{

        window.print();

    });

}



// ==============================
// Page Load
// ==============================

loadSales();