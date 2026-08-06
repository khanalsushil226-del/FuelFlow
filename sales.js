// ==========================================
// FuelFlow Sales Module
// Complete Version
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


// Summary

const totalSalesElement = document.getElementById("totalSales");

const transactionElement = document.getElementById("totalTransactions");

const fuelSoldElement = document.getElementById("totalFuel");


// Print Button

const printBtn = document.getElementById("printReceipt");



// ==============================
// Database
// ==============================

let salesData = JSON.parse(localStorage.getItem("sales")) || [];



// ==============================
// Invoice Generator
// ==============================

function generateInvoice(){

    let lastInvoice = localStorage.getItem("lastInvoice");


    if(lastInvoice === null){

        lastInvoice = 1000;

    }


    let newInvoice = Number(lastInvoice) + 1;


    localStorage.setItem(
        "lastInvoice",
        newInvoice
    );


    return "INV-" + newInvoice;

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



    let invoice = generateInvoice();


    let litres = Number(quantity.value);

    let price = Number(rate.value);

    let amount = litres * price;




    // Create Sale Object

    let sale = {


        invoice: invoice,

        customer: customerName.value,

        vehicle: vehicleNumber.value,

        fuel: fuelType.value,

        quantity: litres,

        rate: price,

        amount: amount,

        payment: payment.value,

        date: new Date().toLocaleString()


    };





    // Save Data

    salesData.push(sale);


    localStorage.setItem(
        "sales",
        JSON.stringify(salesData)
    );




    // Add Table Row

    addSaleRow(sale);



    // Generate Receipt

    generateReceipt(sale);



    // Update Summary

    updateSummary();



    // Clear Form

    customerName.value="";
    vehicleNumber.value="";
    quantity.value="";
    rate.value="";


});






// ==============================
// Add Sale Row
// ==============================


function addSaleRow(sale){


    if(
        salesTableBody.innerText.includes("No sales")
    ){

        salesTableBody.innerHTML="";

    }



    let row = `

    <tr>

        <td>${sale.invoice}</td>

        <td>${sale.customer}</td>

        <td>${sale.vehicle}</td>

        <td>${sale.fuel}</td>

        <td>${sale.quantity} L</td>

        <td>Rs. ${sale.amount}</td>

        <td>${sale.payment}</td>

    </tr>

    `;


    salesTableBody.innerHTML += row;


}







// ==============================
// Generate Receipt
// ==============================


function generateReceipt(sale){


    receiptContent.innerHTML = `


    <p>
    Invoice : ${sale.invoice}
    </p>


    <p>
    Date : ${sale.date}
    </p>


    <hr>


    <p>
    Customer : ${sale.customer}
    </p>


    <p>
    Vehicle : ${sale.vehicle}
    </p>


    <p>
    Fuel : ${sale.fuel}
    </p>


    <p>
    Quantity : ${sale.quantity} L
    </p>


    <p>
    Rate : Rs.${sale.rate}
    </p>


    <p>
    Payment : ${sale.payment}
    </p>


    <hr>


    <h3>
    TOTAL : Rs.${sale.amount}
    </h3>


    `;


}







// ==============================
// Load Previous Sales
// ==============================


function loadSales(){


    salesTableBody.innerHTML="";



    if(salesData.length===0){


        salesTableBody.innerHTML=`

        <tr>

        <td colspan="7">

        No sales recorded yet.

        </td>

        </tr>

        `;


        return;

    }




    salesData.forEach((sale)=>{


        addSaleRow(sale);


    });



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



    if(totalSalesElement){

        totalSalesElement.innerHTML =
        "Rs. " + total;

    }



    if(transactionElement){

        transactionElement.innerHTML =
        salesData.length;

    }



    if(fuelSoldElement){

        fuelSoldElement.innerHTML =
        fuel + " L";

    }


}






// ==============================
// Clear Button
// ==============================


clearBtn.addEventListener("click",(e)=>{


    e.preventDefault();


    customerName.value="";
    vehicleNumber.value="";
    quantity.value="";
    rate.value="";


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

updateSummary();