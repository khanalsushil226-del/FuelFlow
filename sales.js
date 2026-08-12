// ==========================================
// FuelFlow Sales Module
// Clean Version
// Part 1/4
// ==========================================



// ==============================
// Select Elements
// ==============================

const customerName =
document.getElementById("customerName");

const vehicleNumber =
document.getElementById("vehicleNumber");

const fuelType =
document.getElementById("fuelType");

const quantity =
document.getElementById("quantity");

const rate =
document.getElementById("rate");

const payment =
document.getElementById("payment");



const generateBtn =
document.querySelector(".save-btn");

const clearBtn =
document.querySelector(".cancel-btn");



const salesTableBody =
document.getElementById("salesTableBody");

const receiptContent =
document.getElementById("receiptContent");

const searchInput =
document.getElementById("searchSales");
const searchInvoiceBtn =
document.getElementById("searchInvoiceBtn");

const invoiceRecord =
document.getElementById("invoiceRecord");



const totalSalesElement =
document.getElementById("totalSales");

const transactionElement =
document.getElementById("totalTransactions");

const fuelSoldElement =
document.getElementById("totalFuel");



const printBtn =
document.getElementById("printReceipt");

const downloadPdfBtn =
document.getElementById("downloadPdf");
function getFuelStock(){

    return JSON.parse(
        localStorage.getItem("fuelStock")
    ) || {

        petrol:0,
        diesel:0

    };

}



function saveFuelStock(stock){

    localStorage.setItem(

        "fuelStock",

        JSON.stringify(stock)

    );

}




// ==============================
// Local Storage
// ==============================


let salesData =
JSON.parse(localStorage.getItem("sales")) || [];


let currentReceipt = null;




// ==============================
// Invoice Generator
// ==============================


function generateInvoice(){


    let lastInvoice =
    localStorage.getItem("lastInvoice");


    if(!lastInvoice){

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
// Save Sales
// ==============================


function saveSales(){

    localStorage.setItem(

        "sales",

        JSON.stringify(salesData)

    );

}





// ==============================
// Get Fuel Stock
// ==============================


function getFuelStock(){


    return JSON.parse(

        localStorage.getItem("fuelStock")

    ) || {

        petrol:0,

        diesel:0

    };


}





// ==============================
// Save Fuel Stock
// ==============================


function saveFuelStock(stock){


    localStorage.setItem(

        "fuelStock",

        JSON.stringify(stock)

    );


}
// ==========================================
// Part 2/4
// Display Sales + Receipt + Summary
// ==========================================



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


            <td>
                ${sale.invoice}
            </td>


            <td>
                ${sale.customer}
            </td>


            <td>
                ${sale.vehicle}
            </td>


            <td>
                ${sale.fuel}
            </td>


            <td>
                ${sale.quantity} L
            </td>


            <td>
                Rs. ${sale.amount}
            </td>


            <td>
                ${sale.payment}
            </td>


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





// ==============================
// Generate Receipt
// ==============================


function generateReceipt(sale){


    currentReceipt = sale;



    receiptContent.innerHTML = `


    <div class="receipt-header">


        <h2>
            FuelFlow
        </h2>


        <p>
            Smart Petrol Pump
        </p>


        <p>
            Management System
        </p>


    </div>



    <hr>



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
    Rate : Rs. ${sale.rate}
    </p>


    <p>
    Payment : ${sale.payment}
    </p>



    <hr>



    <h3>

    Total : Rs. ${sale.amount}

    </h3>



    <hr>



    <p style="text-align:center">

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



    salesData.forEach((sale)=>{


        totalSales += Number(
            sale.amount
        );


        totalFuel += Number(
            sale.quantity
        );


    });




    totalSalesElement.textContent =

    "Rs. " + totalSales.toLocaleString();




    transactionElement.textContent =

    salesData.length;




    fuelSoldElement.textContent =

    totalFuel + " L";



}






// ==============================
// Load Sales
// ==============================


function loadSales(){


    displaySales(
        salesData
    );


    updateSummary();



}
// ==========================================
// Part 3/4
// Generate Bill + Inventory Connection
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


        alert(
            "Please fill all required fields."
        );


        return;


    }




    const litres =
    Number(quantity.value);



    const price =
    Number(rate.value);






    // ==============================
    // Create Sale Object
    // ==============================


    const sale = {


        invoice:
        generateInvoice(),



        customer:
        customerName.value.trim(),



        vehicle:
        vehicleNumber.value.trim(),



        fuel:
        fuelType.value,



        quantity:
        litres,



        rate:
        price,



        amount:
        litres * price,



        payment:
        payment.value,



        date:
        new Date().toLocaleString()



    };







    // ==============================
    // Inventory Check
    // ==============================


    let fuelStock =
    getFuelStock();




    if(sale.fuel === "Petrol"){



        if(
            fuelStock.petrol < sale.quantity
        ){


            alert(
                "Not enough Petrol available."
            );


            return;


        }



        fuelStock.petrol -=
        sale.quantity;



    }





    else if(sale.fuel === "Diesel"){



        if(
            fuelStock.diesel < sale.quantity
        ){


            alert(
                "Not enough Diesel available."
            );


            return;


        }



        fuelStock.diesel -=
        sale.quantity;



    }






    // Save Updated Stock


    saveFuelStock(
        fuelStock
    );






    // ==============================
    // Save Sale
    // ==============================


    salesData.push(
        sale
    );



    saveSales();






    // ==============================
    // Update UI
    // ==============================


    displaySales(
        salesData
    );



    updateSummary();



    generateReceipt(
        sale
    );






    // ==============================
    // Clear Form
    // ==============================


    customerName.value="";


    vehicleNumber.value="";


    fuelType.selectedIndex=0;


    quantity.value="";


    rate.value="";


    payment.selectedIndex=0;



});







// ==============================
// Clear Button
// ==============================


clearBtn.addEventListener("click",(e)=>{


    e.preventDefault();



    customerName.value="";


    vehicleNumber.value="";


    fuelType.selectedIndex=0;


    quantity.value="";


    rate.value="";


    payment.selectedIndex=0;



});
// ==========================================
// Part 4/4
// Search + View + Print + PDF + Load
// ==========================================



// ==============================
// Search Sales
// ==============================


if(searchInput){


    searchInput.addEventListener(
        "input",
        ()=>{


        const keyword =
        searchInput.value
        .toLowerCase()
        .trim();



        const filteredSales =
        salesData.filter((sale)=>{


            return(

                sale.invoice
                .toLowerCase()
                .includes(keyword)


                ||

                sale.customer
                .toLowerCase()
                .includes(keyword)


                ||

                sale.vehicle
                .toLowerCase()
                .includes(keyword)


            );


        });



        displaySales(
            filteredSales
        );


    });


}







// ==============================
// View Previous Bill
// ==============================


function viewBill(invoice){



    const sale =
    salesData.find(

        item =>
        item.invoice === invoice

    );



    if(!sale){


        alert(
            "Bill not found."
        );


        return;


    }



    generateReceipt(
        sale
    );



}







// ==============================
// Print Previous Bill
// ==============================


function printBill(invoice){



    const sale =
    salesData.find(

        item =>
        item.invoice === invoice

    );



    if(!sale){


        alert(
            "Bill not found."
        );


        return;


    }



    generateReceipt(
        sale
    );



    window.print();



}







// ==============================
// Print Current Receipt
// ==============================


if(printBtn){



    printBtn.addEventListener(
        "click",
        ()=>{



        if(currentReceipt){


            window.print();



        }

        else{


            alert(
                "Generate a bill first."
            );


        }



    });



}







// ==============================
// Download PDF
// ==============================


if(downloadPdfBtn){



downloadPdfBtn.addEventListener(
"click",
()=>{


    if(!currentReceipt){


        alert(
            "Generate or view a bill first."
        );


        return;


    }



    const {jsPDF} =
    window.jspdf;




    const doc =
    new jsPDF({


        orientation:"portrait",


        unit:"mm",


        format:[80,160]


    });





    let y = 10;



    doc.setFont(
        "courier",
        "bold"
    );


    doc.setFontSize(16);


    doc.text(
        "FuelFlow",
        40,
        y,
        {
            align:"center"
        }
    );



    y += 8;



    doc.setFont(
        "courier",
        "normal"
    );



    doc.setFontSize(9);



    doc.text(
        "Smart Petrol Pump",
        40,
        y,
        {
            align:"center"
        }
    );



    y += 5;



    doc.text(
        "Management System",
        40,
        y,
        {
            align:"center"
        }
    );



    y += 8;



    doc.line(
        5,
        y,
        75,
        y
    );



    y += 8;



    doc.text(
        `Invoice: ${currentReceipt.invoice}`,
        5,
        y
    );


    y += 6;


    doc.text(
        `Date: ${currentReceipt.date}`,
        5,
        y
    );


    y += 7;


    doc.text(
        `Customer: ${currentReceipt.customer}`,
        5,
        y
    );


    y += 6;


    doc.text(
        `Vehicle: ${currentReceipt.vehicle}`,
        5,
        y
    );


    y += 6;


    doc.text(
        `Fuel: ${currentReceipt.fuel}`,
        5,
        y
    );


    y += 6;


    doc.text(
        `Quantity: ${currentReceipt.quantity} L`,
        5,
        y
    );


    y += 6;


    doc.text(
        `Rate: Rs. ${currentReceipt.rate}`,
        5,
        y
    );


    y += 6;


    doc.text(
        `Payment: ${currentReceipt.payment}`,
        5,
        y
    );



    y += 8;



    doc.line(
        5,
        y,
        75,
        y
    );



    y += 8;



    doc.setFont(
        "courier",
        "bold"
    );



    doc.text(
        `TOTAL: Rs. ${currentReceipt.amount}`,
        5,
        y
    );



    y += 10;



    doc.setFont(
        "courier",
        "normal"
    );



    doc.text(
        "Thank You! Visit Again",
        40,
        y,
        {
            align:"center"
        }
    );



    doc.save(
        `Receipt_${currentReceipt.invoice}.pdf`
    );



});


}








// ==============================
// Page Load
// ==============================


loadSales();



updateSummary();