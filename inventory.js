// ==========================================
// FuelFlow Inventory Module
// Part 1/3
// ==========================================



// ==============================
// Select Elements
// ==============================


const inventoryFuel =
document.getElementById("inventoryFuel");


const inventoryQuantity =
document.getElementById("inventoryQuantity");


const supplier =
document.getElementById("supplier");


const cost =
document.getElementById("cost");


const addStockBtn =
document.getElementById("addStock");



const petrolStockElement =
document.getElementById("petrolStock");


const dieselStockElement =
document.getElementById("dieselStock");


const inventoryTable =
document.getElementById("inventoryTable");





// ==============================
// Database
// ==============================


let fuelStock = {

    petrol:0,

    diesel:0

};



const savedStock = localStorage.getItem("fuelStock");


if(savedStock && savedStock !== "undefined"){

    fuelStock = JSON.parse(savedStock);

}





let inventoryHistory = [];



const savedHistory = localStorage.getItem("inventoryHistory");


if(savedHistory && savedHistory !== "undefined"){

    inventoryHistory = JSON.parse(savedHistory);

}





// ==============================
// Save Functions
// ==============================


function saveFuelStock(){


    localStorage.setItem(

        "fuelStock",

        JSON.stringify(fuelStock)

    );


}





function saveInventoryHistory(){


    localStorage.setItem(

        "inventoryHistory",

        JSON.stringify(inventoryHistory)

    );


}
// ==========================================
// Part 2/3
// Add Stock Function
// ==========================================



// ==============================
// Add Fuel Stock
// ==============================


addStockBtn.addEventListener("click",(e)=>{


    e.preventDefault();



    // Validation

    if(

        inventoryQuantity.value.trim()==="" ||

        supplier.value.trim()==="" ||

        cost.value.trim()===""

    ){

        alert("Please fill all fields.");

        return;

    }





    const fuel = inventoryFuel.value;


    const quantity = Number(
        inventoryQuantity.value
    );


    const price = Number(
        cost.value
    );





    if(quantity <= 0){

        alert("Enter valid quantity.");

        return;

    }






    // ==============================
    // Update Fuel Stock
    // ==============================


    if(fuel === "Petrol"){

        fuelStock.petrol += quantity;

    }


    else if(fuel === "Diesel"){

        fuelStock.diesel += quantity;

    }






    // Save Stock

    saveFuelStock();







    // ==============================
    // Inventory Record
    // ==============================


    const record = {


        date:new Date().toLocaleDateString(),


        fuel:fuel,


        supplier:supplier.value.trim(),


        invoice:"STK-" + Date.now(),


        quantity:quantity,


        cost:price,


        total:quantity * price


    };






    inventoryHistory.push(record);



    saveInventoryHistory();







    // Update UI


    updateStockCards();


    displayInventoryHistory();







    // Clear Inputs


    inventoryQuantity.value="";

    supplier.value="";

    cost.value="";






    alert("Stock Added Successfully!");



});
// ==========================================
// Part 3/3
// Update UI + Inventory History + Initialize
// ==========================================



// ==============================
// Update Stock Cards
// ==============================


function updateStockCards(){


    if(petrolStockElement){

        petrolStockElement.textContent =
        fuelStock.petrol + " L";

    }



    if(dieselStockElement){

        dieselStockElement.textContent =
        fuelStock.diesel + " L";

    }




    // Progress Bars


    const petrolBar =
    document.querySelector(".petrol-progress");


    const dieselBar =
    document.querySelector(".diesel-progress");



    const capacity = 10000;





    if(petrolBar){


        let percentage =
        (fuelStock.petrol / capacity) * 100;


        if(percentage > 100){

            percentage = 100;

        }


        petrolBar.style.width =
        percentage + "%";


        if(fuelStock.petrol < 1000){

            petrolBar.classList.add(
                "low-stock-bar"
            );

        }


    }





    if(dieselBar){


        let percentage =
        (fuelStock.diesel / capacity) * 100;


        if(percentage > 100){

            percentage = 100;

        }


        dieselBar.style.width =
        percentage + "%";



        if(fuelStock.diesel < 1000){

            dieselBar.classList.add(
                "low-stock-bar"
            );

        }


    }


}






// ==============================
// Display Inventory History
// ==============================


function displayInventoryHistory(){


    if(!inventoryTable){

        return;

    }



    inventoryTable.innerHTML = "";




    if(inventoryHistory.length === 0){


        inventoryTable.innerHTML = `

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


        inventoryTable.innerHTML += `

        <tr>

            <td>${item.date}</td>

            <td>${item.fuel}</td>

            <td>${item.supplier}</td>

            <td>${item.invoice}</td>

            <td>${item.quantity} L</td>

            <td>Rs. ${item.cost}</td>

            <td>Rs. ${item.total}</td>


        </tr>

        `;


    });


}






// ==============================
// Sales.js Connection
// ==============================


window.getFuelStock = function(){


    return fuelStock;


};





window.saveFuelStock = function(){


    localStorage.setItem(

        "fuelStock",

        JSON.stringify(fuelStock)

    );


};








// ==============================
// Initialize Inventory
// ==============================


function initializeInventory(){


    const savedStock =
    localStorage.getItem("fuelStock");



    if(savedStock && savedStock !== "undefined"){

        fuelStock = JSON.parse(savedStock);

    }





    const savedHistory =
    localStorage.getItem("inventoryHistory");



    if(savedHistory && savedHistory !== "undefined"){

        inventoryHistory = JSON.parse(savedHistory);

    }





    updateStockCards();


    displayInventoryHistory();


}








// ==============================
// Auto Sync With Sales
// ==============================


setInterval(()=>{


    const updatedStock =
    localStorage.getItem("fuelStock");


    if(updatedStock && updatedStock !== "undefined"){


        fuelStock = JSON.parse(updatedStock);


        updateStockCards();


    }


},3000);







// ==============================
// Start
// ==============================


initializeInventory();