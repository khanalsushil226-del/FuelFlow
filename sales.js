// ==========================================
// FuelFlow Sales Module
// ==========================================


// Selecting Elements

const customerName = document.getElementById("customerName");
const vehicleNumber = document.getElementById("vehicleNumber");
const fuelType = document.getElementById("fuelType");
const quantity = document.getElementById("quantity");
const rate = document.getElementById("rate");
const payment = document.getElementById("payment");


const generateBtn = document.querySelector(".save-btn");
const clearBtn = document.querySelector(".cancel-btn");


const salesTableBody = document.getElementById("salesTableBody");
const receiptBody = document.getElementById("receiptBody");


// Summary Elements

const totalSalesElement = document.getElementById("totalSales");

const transactionElement = document.getElementById("totalTransactions");

const fuelSoldElement = document.getElementById("totalFuel");

// Data

let totalSales = 0;
let transactions = 0;
let fuelSold = 0;


// ==========================================
// Generate Invoice Number
// ==========================================

function generateInvoice(){

    let number = Math.floor(Math.random()*9000)+1000;

    return "INV-" + number;

}



// ==========================================
// Generate Bill
// ==========================================


generateBtn.addEventListener("click", function(e){


    e.preventDefault();



    // Validation

    if(customerName.value === "" ||
       vehicleNumber.value === "" ||
       quantity.value === ""){


        alert("Please fill all required fields.");

        return;

    }



    let invoice = generateInvoice();


    let litres = Number(quantity.value);

    let price = Number(rate.value);


    let amount = litres * price;



    // Update Summary

    totalSales += amount;

    transactions++;

    fuelSold += litres;



    totalSalesElement.innerHTML = 
        "Rs. " + totalSales.toFixed(2);


    transactionElement.innerHTML =
        transactions;


    fuelSoldElement.innerHTML =
        fuelSold + " L";



    // Add Sale To Table


    let row = `

        <tr>

            <td>${invoice}</td>

            <td>${customerName.value}</td>

            <td>${vehicleNumber.value}</td>

            <td>${fuelType.value}</td>

            <td>${litres} L</td>

            <td>Rs. ${amount}</td>

            <td>${payment.value}</td>


        </tr>

    `;



    // Remove empty message

    if(salesTableBody.innerText.includes("No sales")){

        salesTableBody.innerHTML="";

    }



    salesTableBody.innerHTML += row;



    // Generate Receipt


    receiptBody.innerHTML = `

        <p>
        Invoice: ${invoice}
        </p>


        <p>
        Customer: ${customerName.value}
        </p>


        <p>
        Vehicle: ${vehicleNumber.value}
        </p>


        <p>
        Fuel: ${fuelType.value}
        </p>


        <p>
        Quantity: ${litres} L
        </p>


        <p>
        Rate: Rs. ${price}
        </p>


        <p>
        Payment: ${payment.value}
        </p>


        <hr>


        <h3>
        Total: Rs. ${amount}
        </h3>


    `;



    // Clear Form

    customerName.value="";
    vehicleNumber.value="";
    quantity.value="";


});