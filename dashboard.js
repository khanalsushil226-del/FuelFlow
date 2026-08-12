// ==========================================
// FuelFlow Dashboard
// Part 1
// ==========================================



// ==============================
// Check Login
// ==============================

if(sessionStorage.getItem("loggedIn") !== "true"){

    window.location.href = "index.html";

}



// ==============================
// Select Elements
// ==============================

const dashboardSales =
document.getElementById("dashboardSales");

const dashboardTransactions =
document.getElementById("dashboardTransactions");

const dashboardFuel =
document.getElementById("dashboardFuel");
const dashboardPetrolStock =
document.getElementById("dashboardPetrolStock");

const dashboardDieselStock =
document.getElementById("dashboardDieselStock");

const dashboardTotalStock =
document.getElementById("dashboardTotalStock");

const dashboardCustomers =
document.getElementById("dashboardCustomers");

const recentTransactions =
document.getElementById("recentTransactions");

const salesChartCanvas =
document.getElementById("salesChart");



// ==============================
// Database
// ==============================

let salesData = JSON.parse(

    localStorage.getItem("sales")

) || [];

let salesChart = null;



// ==============================
// Dashboard Cards
// ==============================

function updateDashboardCards(){

    let totalSales = 0;

    let totalFuel = 0;

    let customers = [];



    salesData.forEach((sale)=>{

        totalSales += Number(sale.amount);

        totalFuel += Number(sale.quantity);

        customers.push(sale.customer);

    });



    dashboardSales.textContent =
    "Rs. " + totalSales.toLocaleString();



    dashboardTransactions.textContent =
    salesData.length;



    if(dashboardFuel){

        dashboardFuel.textContent =
        totalFuel + " L";

    }



    if(dashboardCustomers){

        const uniqueCustomers =
        [...new Set(customers)];

        dashboardCustomers.textContent =
        uniqueCustomers.length;

    }

}
// ==============================
// Dashboard Inventory
// ==============================

function updateDashboardInventory() {

    const savedStock =
        localStorage.getItem("fuelStock");

    let fuelStock = {
        petrol: 0,
        diesel: 0
    };

    if (savedStock) {

        try {
            fuelStock = JSON.parse(savedStock);
        }

        catch (error) {
            console.error("Unable to load fuel stock.", error);
        }

    }

    const petrol =
        Number(fuelStock.petrol || 0);

    const diesel =
        Number(fuelStock.diesel || 0);

    if (dashboardPetrolStock) {
        dashboardPetrolStock.textContent =
            petrol.toLocaleString() + " L";
    }

    if (dashboardDieselStock) {
        dashboardDieselStock.textContent =
            diesel.toLocaleString() + " L";
    }

    if (dashboardTotalStock) {
        dashboardTotalStock.textContent =
            (petrol + diesel).toLocaleString() + " L";
    }

}
// ==========================================
// Part 2
// Sales Chart
// ==========================================



// ==============================
// Load Sales Chart
// ==============================

function loadSalesChart(){

    if(!salesChartCanvas){

        return;

    }


    const labels = [];

    const totals = [];


    // Last 7 Days

    for(let i = 6; i >= 0; i--){

        const date = new Date();

        date.setDate(date.getDate() - i);

        labels.push(

            date.toLocaleDateString("en-US",{

                weekday:"short"

            })

        );

        totals.push(0);

    }



    // Calculate Sales

    salesData.forEach((sale)=>{

        const saleDate = new Date(sale.date);

        const today = new Date();

        const difference = Math.floor(

            (today - saleDate) /

            (1000 * 60 * 60 * 24)

        );

        if(difference >= 0 && difference <= 6){

            totals[6 - difference] +=
            Number(sale.amount);

        }

    });



    // Destroy Old Chart

    if(salesChart){

        salesChart.destroy();

    }



    // Create New Chart

    salesChart = new Chart(

        salesChartCanvas,

        {

            type:"line",

            data:{

                labels:labels,

                datasets:[{

                    label:"Daily Sales",

                    data:totals,

                    borderColor:"#2563eb",

                    backgroundColor:"rgba(37,99,235,.15)",

                    borderWidth:3,

                    fill:true,

                    tension:.4,

                    pointRadius:5,

                    pointHoverRadius:7

                }]

            },

            options:{

                responsive:true,

                maintainAspectRatio:false,

                plugins:{

                    legend:{
                        display:false
                    }

                },

                scales:{

                    y:{

                        beginAtZero:true,

                        ticks:{

                            callback:function(value){

                                return "Rs. " + value;

                            }

                        }

                    }

                }

            }

        }

    );

}
// ==========================================
// Part 3
// Recent Transactions
// ==========================================



// ==============================
// Load Recent Transactions
// ==============================

function loadRecentTransactions(){

    if(!recentTransactions){

        return;

    }

    recentTransactions.innerHTML = "";



    if(salesData.length === 0){

        recentTransactions.innerHTML = `

        <tr>

            <td colspan="5">

                No transactions available.

            </td>

        </tr>

        `;

        return;

    }



    // Latest 5 Sales

    const latestSales = [...salesData]

        .reverse()

        .slice(0,5);



    latestSales.forEach((sale)=>{

        recentTransactions.innerHTML += `

        <tr>

            <td>${sale.invoice}</td>

            <td>${sale.customer}</td>

            <td>${sale.fuel}</td>

            <td>Rs. ${Number(sale.amount).toLocaleString()}</td>

            <td>

                <span class="status success">

                    Completed

                </span>

            </td>

        </tr>

        `;

    });

}
// ==========================================
// Part 4
// Dashboard Initialization
// ==========================================



// ==============================
// Initialize Dashboard
// ==============================

function initializeDashboard(){

    // Reload latest data

    salesData = JSON.parse(

        localStorage.getItem("sales")

    ) || [];



    // Update Cards

    updateDashboardCards();



    // Update Chart

    loadSalesChart();



    // Update Recent Transactions

    loadRecentTransactions();

}



// ==============================
// Auto Refresh Dashboard
// ==============================

setInterval(()=>{

    initializeDashboard();

},3000);



// ==============================
// Initial Page Load
// ==============================

initializeDashboard();
updateDashboardInventory();