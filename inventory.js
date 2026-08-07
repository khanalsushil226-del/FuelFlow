// ==========================================
// FuelFlow Inventory Module
// Part 1
// ==========================================



// ==============================
// Select Elements
// ==============================

const fuelType = document.getElementById("fuelType");

const supplier = document.getElementById("supplier");

const quantity = document.getElementById("quantity");

const cost = document.getElementById("cost");

const invoice = document.getElementById("invoice");

const date = document.getElementById("date");

const saveInventory =
document.getElementById("saveInventory");

const clearInventory =
document.getElementById("clearInventory");



const petrolStock =
document.getElementById("petrolStock");

const dieselStock =
document.getElementById("dieselStock");



const petrolProgress =
document.getElementById("petrolProgress");

const dieselProgress =
document.getElementById("dieselProgress");



const inventoryTableBody =
document.getElementById("inventoryTableBody");



// ==============================
// Local Storage
// ==============================

let inventoryHistory = JSON.parse(

    localStorage.getItem("inventoryHistory")

) || [];



let fuelStock = JSON.parse(

    localStorage.getItem("fuelStock")

) || {

    petrol:0,

    diesel:0

};



// Tank Capacity

const MAX_CAPACITY = 10000;
// ==========================================
// Part 2
// Add Fuel Stock
// ==========================================



// ==============================
// Save Inventory
// ==============================

saveInventory.addEventListener("click",(e)=>{

    e.preventDefault();



    if(

        supplier.value.trim()==="" ||

        quantity.value.trim()==="" ||

        cost.value.trim()==="" ||

        invoice.value.trim()==="" ||

        date.value===""

    ){

        alert("Please fill all fields.");

        return;

    }



    const litres = Number(quantity.value);

    const price = Number(cost.value);



    const stock = {

        fuel : fuelType.value,

        supplier : supplier.value.trim(),

        quantity : litres,

        cost : price,

        total : litres * price,

        invoice : invoice.value.trim(),

        date : date.value

    };



    // Save History

    inventoryHistory.push(stock);



    localStorage.setItem(

        "inventoryHistory",

        JSON.stringify(inventoryHistory)

    );



    // Update Stock

    if(stock.fuel==="Petrol"){

        fuelStock.petrol += litres;

    }

    else{

        fuelStock.diesel += litres;

    }



    localStorage.setItem(

        "fuelStock",

        JSON.stringify(fuelStock)

    );



    // Refresh UI

    loadInventory();

    updateStockCards();



    // Clear Form

    supplier.value="";

    quantity.value="";

    cost.value="";

    invoice.value="";

    date.value="";



    fuelType.selectedIndex=0;



    alert("Fuel stock added successfully.");

});
// ==========================================
// Part 3
// Load Inventory & Update Stock Cards
// ==========================================



// ==============================
// Load Inventory History
// ==============================

function loadInventory(){

    inventoryTableBody.innerHTML = "";

    if(inventoryHistory.length === 0){

        inventoryTableBody.innerHTML = `

            <tr>

                <td colspan="7">

                    No inventory records found.

                </td>

            </tr>

        `;

        return;

    }



    inventoryHistory
        .slice()
        .reverse()
        .forEach((item)=>{

        inventoryTableBody.innerHTML += `

            <tr>

                <td>${item.date}</td>

                <td>${item.fuel}</td>

                <td>${item.supplier}</td>

                <td>${item.invoice}</td>

                <td>${item.quantity} L</td>

                <td>Rs. ${item.cost}</td>

                <td>Rs. ${item.total.toLocaleString()}</td>

            </tr>

        `;

    });

}



// ==============================
// Update Stock Cards
// ==============================

function updateStockCards(){

    // Update Text

    petrolStock.textContent =
        fuelStock.petrol.toLocaleString() + " L";

    dieselStock.textContent =
        fuelStock.diesel.toLocaleString() + " L";



    // Calculate Percentage

    const petrolPercentage = Math.min(

        (fuelStock.petrol / MAX_CAPACITY) * 100,

        100

    );



    const dieselPercentage = Math.min(

        (fuelStock.diesel / MAX_CAPACITY) * 100,

        100

    );



    // Animate Progress Bars

    petrolProgress.style.width =
        petrolPercentage + "%";

    dieselProgress.style.width =
        dieselPercentage + "%";



    // Low Stock Warning

    if(fuelStock.petrol < 2000){

        petrolStock.classList.add("low-stock");

        petrolProgress.classList.add("low-stock-bar");

    }else{

        petrolStock.classList.remove("low-stock");

        petrolProgress.classList.remove("low-stock-bar");

    }



    if(fuelStock.diesel < 2000){

        dieselStock.classList.add("low-stock");

        dieselProgress.classList.add("low-stock-bar");

    }else{

        dieselStock.classList.remove("low-stock");

        dieselProgress.classList.remove("low-stock-bar");

    }

}
// ==========================================
// Part 4
// Clear Form & Initialize Inventory
// ==========================================



// ==============================
// Clear Form
// ==============================

clearInventory.addEventListener("click",(e)=>{

    e.preventDefault();

    fuelType.selectedIndex = 0;

    supplier.value = "";

    quantity.value = "";

    cost.value = "";

    invoice.value = "";

    date.value = "";

});



// ==============================
// Helper Functions
// ==============================

// Save fuel stock back to localStorage
function saveFuelStock(){

    localStorage.setItem(

        "fuelStock",

        JSON.stringify(fuelStock)

    );

}



// Reload latest data from localStorage
function refreshInventory(){

    inventoryHistory = JSON.parse(

        localStorage.getItem("inventoryHistory")

    ) || [];



    fuelStock = JSON.parse(

        localStorage.getItem("fuelStock")

    ) || {

        petrol:0,

        diesel:0

    };



    loadInventory();

    updateStockCards();

}



// ==============================
// Page Load
// ==============================

refreshInventory();



// ==============================
// Auto Refresh
// ==============================

// If another page (like Sales) updates inventory,
// refresh this page every 2 seconds.

setInterval(()=>{

    refreshInventory();

},2000);