// ==========================================
// FuelFlow Sales JavaScript
// ==========================================

// Select Elements

const form = document.querySelector("form");

const invoiceInput = document.querySelector("input[value='INV-1001']");
const dateInput = document.querySelector("input[type='date']");

const vehicleInput = document.querySelector("input[placeholder='BA 01 PA 1234']");
const customerInput = document.querySelector("input[placeholder='Customer Name']");

const fuelRateInput = document.querySelector("input[value='180']");
const litreInput = document.querySelector("input[placeholder='0']");

const amountInput = document.querySelector("input[value='Rs. 0']");

// ==========================================
// Generate Invoice Number
// ==========================================

const invoiceNumber = Math.floor(Math.random() * 9000) + 1000;

invoiceInput.value = `INV-${invoiceNumber}`;

// ==========================================
// Today's Date
// ==========================================

const today = new Date().toISOString().split("T")[0];

dateInput.value = today;

// ==========================================
// Calculate Total
// ==========================================

function calculateTotal() {

    const rate = Number(fuelRateInput.value);
    const litres = Number(litreInput.value);

    const total = rate * litres;

    amountInput.value = "Rs. " + total.toFixed(2);

}

fuelRateInput.addEventListener("input", calculateTotal);

litreInput.addEventListener("input", calculateTotal);

// ==========================================
// Form Submit
// ==========================================

form.addEventListener("submit", function(e){

    e.preventDefault();

    if(vehicleInput.value.trim()===""){

        alert("Please enter vehicle number.");

        vehicleInput.focus();

        return;

    }

    if(customerInput.value.trim()===""){

        alert("Please enter customer name.");

        customerInput.focus();

        return;

    }

    if(litreInput.value===""){

        alert("Please enter fuel quantity.");

        litreInput.focus();

        return;

    }

    alert("Bill Generated Successfully!");

});

// ==========================================
// Clear Button
// ==========================================

form.addEventListener("reset", function(){

    setTimeout(function(){

        amountInput.value="Rs. 0";

        litreInput.value="";

    },50);

});