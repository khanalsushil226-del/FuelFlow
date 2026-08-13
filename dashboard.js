
// ==========================================================
// FuelFlow Dashboard JavaScript
// Complete Dashboard Logic
// ==========================================================


// ==========================================================
// LOGIN CHECK
// ==========================================================

if (sessionStorage.getItem("loggedIn") !== "true") {

    window.location.href = "index.html";

}


// ==========================================================
// SELECT ELEMENTS
// ==========================================================

const dashboardSales =
    document.getElementById("dashboardSales");

const dashboardTransactions =
    document.getElementById("dashboardTransactions");

const dashboardFuelStock =
    document.getElementById("dashboardFuelStock");

const recentTransactions =
    document.getElementById("recentTransactions");

const emptyTransactions =
    document.getElementById("emptyTransactions");

const salesChartCanvas =
    document.getElementById("salesChart");


// Fuel inventory elements

const petrolStock =
    document.getElementById("petrolStock");

const dieselStock =
    document.getElementById("dieselStock");

const premiumStock =
    document.getElementById("premiumStock");

const petrolProgress =
    document.getElementById("petrolProgress");

const dieselProgress =
    document.getElementById("dieselProgress");

const premiumProgress =
    document.getElementById("premiumProgress");

const petrolPercentage =
    document.getElementById("petrolPercentage");

const dieselPercentage =
    document.getElementById("dieselPercentage");

const premiumPercentage =
    document.getElementById("premiumPercentage");

const petrolStatus =
    document.getElementById("petrolStatus");

const dieselStatus =
    document.getElementById("dieselStatus");

const premiumStatus =
    document.getElementById("premiumStatus");

const petrolFuelItem =
    document.getElementById("petrolFuelItem");

const dieselFuelItem =
    document.getElementById("dieselFuelItem");

const premiumFuelItem =
    document.getElementById("premiumFuelItem");


// ==========================================================
// DATABASE
// ==========================================================

let salesData =
    JSON.parse(localStorage.getItem("sales")) || [];

let salesChart = null;


// ==========================================================
// UPDATE DASHBOARD CARDS
// ==========================================================

function updateDashboardCards() {

    let totalSales = 0;

    let totalFuel = 0;


    salesData.forEach((sale) => {

        totalSales +=
            Number(sale.amount) || 0;

        totalFuel +=
            Number(sale.quantity) || 0;

    });


    // Today's sales

    dashboardSales.textContent =
        "Rs. " + totalSales.toLocaleString();


    // Transactions

    dashboardTransactions.textContent =
        salesData.length;


    // Total fuel sold

    if (dashboardFuelStock) {

        dashboardFuelStock.textContent =
            totalFuel.toLocaleString() + " L";

    }

}


// ==========================================================
// LOAD INVENTORY
// ==========================================================

function updateDashboardInventory() {

    const savedStock =
        localStorage.getItem("fuelStock");


    let fuelStock = {

        petrol: 0,

        diesel: 0,

        premium: 0

    };


    if (savedStock) {

        try {

            fuelStock =
                JSON.parse(savedStock);

        }

        catch (error) {

            console.error(
                "Unable to load fuel stock.",
                error
            );

        }

    }


    const petrol =
        Number(fuelStock.petrol) || 0;

    const diesel =
        Number(fuelStock.diesel) || 0;

    const premium =
        Number(fuelStock.premium) || 0;


    // Update inventory UI

    updateFuelItem(
        "petrol",
        petrol,
        5000
    );


    updateFuelItem(
        "diesel",
        diesel,
        5000
    );


    updateFuelItem(
        "premium",
        premium,
        3000
    );


    // Total dashboard stock

    const totalStock =
        petrol +
        diesel +
        premium;


    if (dashboardFuelStock) {

        dashboardFuelStock.textContent =
            totalStock.toLocaleString() + " L";

    }

}


// ==========================================================
// UPDATE INDIVIDUAL FUEL
// ==========================================================

function updateFuelItem(
    fuel,
    stock,
    capacity
) {


    let stockElement;

    let progressElement;

    let percentageElement;

    let statusElement;

    let itemElement;


    if (fuel === "petrol") {

        stockElement = petrolStock;

        progressElement = petrolProgress;

        percentageElement = petrolPercentage;

        statusElement = petrolStatus;

        itemElement = petrolFuelItem;

    }


    else if (fuel === "diesel") {

        stockElement = dieselStock;

        progressElement = dieselProgress;

        percentageElement = dieselPercentage;

        statusElement = dieselStatus;

        itemElement = dieselFuelItem;

    }


    else if (fuel === "premium") {

        stockElement = premiumStock;

        progressElement = premiumProgress;

        percentageElement = premiumPercentage;

        statusElement = premiumStatus;

        itemElement = premiumFuelItem;

    }


    if (!stockElement) {

        return;

    }


    // Calculate percentage

    let percentage =
        (stock / capacity) * 100;


    percentage =
        Math.max(
            0,
            Math.min(
                percentage,
                100
            )
        );


    // Stock

    stockElement.textContent =
        stock.toLocaleString() + " L";


    // Progress

    if (progressElement) {

        progressElement.style.width =
            percentage + "%";

    }


    // Percentage

    if (percentageElement) {

        percentageElement.textContent =
            Math.round(percentage) + "%";

    }


    // Remove old states

    if (itemElement) {

        itemElement.classList.remove(
            "low-stock",
            "critical-stock"
        );

    }


    // Status

    if (percentage <= 10) {

        if (statusElement) {

            statusElement.textContent =
                "Critical Stock";

        }

        if (itemElement) {

            itemElement.classList.add(
                "critical-stock"
            );

        }

    }


    else if (percentage <= 20) {

        if (statusElement) {

            statusElement.textContent =
                "Low Stock";

        }

        if (itemElement) {

            itemElement.classList.add(
                "low-stock"
            );

        }

    }


    else if (percentage <= 40) {

        if (statusElement) {

            statusElement.textContent =
                "Running Low";

        }

    }


    else {

        if (statusElement) {

            statusElement.textContent =
                "Available";

        }

    }

}


// ==========================================================
// SALES CHART
// ==========================================================

function loadSalesChart() {

    if (!salesChartCanvas) {

        return;

    }


    const labels = [];

    const totals = [];


    // Last 7 days

    for (let i = 6; i >= 0; i--) {

        const date = new Date();

        date.setHours(0, 0, 0, 0);

        date.setDate(
            date.getDate() - i
        );


        labels.push(

            date.toLocaleDateString(
                "en-US",
                {
                    weekday: "short"
                }
            )

        );


        totals.push(0);

    }


    // Calculate sales

    salesData.forEach((sale) => {

        const saleDate =
            new Date(sale.date);


        if (isNaN(saleDate)) {

            return;

        }


        saleDate.setHours(
            0,
            0,
            0,
            0
        );


        const today =
            new Date();

        today.setHours(
            0,
            0,
            0,
            0
        );


        const difference =
            Math.floor(

                (
                    today -
                    saleDate
                ) /
                (
                    1000 *
                    60 *
                    60 *
                    24
                )

            );


        if (
            difference >= 0 &&
            difference <= 6
        ) {

            totals[
                6 - difference
            ] +=
                Number(sale.amount) || 0;

        }

    });


    // Destroy previous chart

    if (salesChart) {

        salesChart.destroy();

    }


    // Create chart

    salesChart =
        new Chart(
            salesChartCanvas,
            {

                type: "line",


                data: {

                    labels: labels,

                    datasets: [

                        {

                            label: "Daily Sales",

                            data: totals,

                            borderColor: "#2563eb",

                            backgroundColor:
                                "rgba(37, 99, 235, .12)",

                            borderWidth: 3,

                            fill: true,

                            tension: .4,

                            pointRadius: 4,

                            pointHoverRadius: 7

                        }

                    ]

                },


                options: {

                    responsive: true,

                    maintainAspectRatio: false,


                    plugins: {

                        legend: {

                            display: false

                        }

                    },


                    scales: {

                        y: {

                            beginAtZero: true,

                            ticks: {

                                callback:
                                    function (value) {

                                        return (
                                            "Rs. " +
                                            value.toLocaleString()
                                        );

                                    }

                            }

                        }

                    }

                }

            }
        );

}


// ==========================================================
// FORMAT DATE
// ==========================================================

function formatTransactionDate(sale) {

    const dateValue =
        sale.date ||
        sale.timestamp;


    if (!dateValue) {

        return "-";

    }


    const date =
        new Date(dateValue);


    if (isNaN(date)) {

        return "-";

    }


    return date.toLocaleString(
        "en-NP",
        {
            dateStyle: "short",
            timeStyle: "short"
        }
    );

}


// ==========================================================
// LOAD RECENT TRANSACTIONS
// ==========================================================

function loadRecentTransactions() {

    if (!recentTransactions) {

        return;

    }


    recentTransactions.innerHTML = "";


    // Empty state

    if (salesData.length === 0) {

        if (emptyTransactions) {

            emptyTransactions.style.display =
                "flex";

        }

        return;

    }


    if (emptyTransactions) {

        emptyTransactions.style.display =
            "none";

    }


    // Latest 10 sales

    const latestSales =
        [...salesData]
            .reverse()
            .slice(0, 10);


    latestSales.forEach((sale, index) => {


        const invoice =
            sale.invoice ||
            sale.invoiceNumber ||
            `INV-${1001 + index}`;


        const customer =
            sale.customer ||
            sale.customerName ||
            "Walk-in Customer";


        const vehicle =
            sale.vehicle ||
            sale.vehicleNumber ||
            "-";


        const fuel =
            sale.fuel ||
            sale.fuelType ||
            "-";


        const quantity =
            Number(
                sale.quantity
            ) || 0;


        const amount =
            Number(
                sale.amount
            ) || 0;


        const payment =
            sale.payment ||
            sale.paymentMethod ||
            "-";


        const status =
            sale.status ||
            "Completed";


        const statusClass =
            status
                .toLowerCase()
                .replace(
                    /\s+/g,
                    "-"
                );


        const dateText =
            formatTransactionDate(
                sale
            );


        // Create row

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>

                <span class="invoice-number">

                    ${invoice}

                </span>

            </td>


            <td>

                <span class="customer-name">

                    ${customer}

                </span>

            </td>


            <td>

                ${vehicle}

            </td>


            <td>

                ${fuel}

            </td>


            <td>

                ${quantity.toLocaleString()} L

            </td>


            <td>

                <span class="transaction-amount">

                    Rs. ${amount.toLocaleString()}

                </span>

            </td>


            <td>

                ${payment}

            </td>


            <td>

                <span
                    class="transaction-status ${statusClass}"
                >

                    ${status}

                </span>

            </td>


            <td>

                ${dateText}

            </td>


            <td>

                <button
                    type="button"
                    class="transaction-view-btn"
                    title="View Transaction"
                    onclick="viewTransaction('${invoice}')"
                >

                    <i class="fa-solid fa-eye"></i>

                </button>

            </td>

        `;


        recentTransactions.appendChild(
            row
        );

    });

}


// ==========================================================
// VIEW TRANSACTION
// ==========================================================

function viewTransaction(invoice) {

    const currentSales =
        JSON.parse(
            localStorage.getItem("sales")
        ) || [];


    const transaction =
        currentSales.find(
            (sale) => {

                const saleInvoice =
                    sale.invoice ||
                    sale.invoiceNumber;

                return String(
                    saleInvoice
                ) === String(invoice);

            }
        );


    if (!transaction) {

        alert(
            "Transaction details not found."
        );

        return;

    }


    // Save selected transaction

    localStorage.setItem(
        "selectedTransaction",
        JSON.stringify(transaction)
    );


    // Open sales page

    window.location.href =
        "sales.html";

}


// ==========================================================
// INITIALIZE DASHBOARD
// ==========================================================

function initializeDashboard() {


    // Reload sales data

    salesData =
        JSON.parse(
            localStorage.getItem("sales")
        ) || [];


    // Cards

    updateDashboardCards();


    // Inventory

    updateDashboardInventory();


    // Chart

    loadSalesChart();


    // Transactions

    loadRecentTransactions();

}


// ==========================================================
// INITIAL PAGE LOAD
// ==========================================================

initializeDashboard();


// ==========================================================
// AUTO REFRESH
// ==========================================================

setInterval(
    initializeDashboard,
    3000
);