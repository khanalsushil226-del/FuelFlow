// ==========================================================
// FuelFlow Dashboard JavaScript
// COMPLETE DASHBOARD LOGIC
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

const dashboardCashSales =
    document.getElementById("dashboardCashSales");

const dashboardCardSales =
    document.getElementById("dashboardCardSales");

const dashboardOnlineSales =
    document.getElementById("dashboardOnlineSales");

const dashboardOtherSales =
    document.getElementById("dashboardOtherSales");

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


// ==========================================================
// FUEL INVENTORY ELEMENTS
// ==========================================================

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
// HELPER — FORMAT CURRENCY
// ==========================================================

function formatCurrency(amount) {

    return "Rs. " +
        Number(amount || 0).toLocaleString();

}


// ==========================================================
// HELPER — GET PAYMENT METHOD
// ==========================================================

function getPaymentMethod(sale) {

    return String(
        sale.payment ||
        sale.paymentMethod ||
        "Other"
    )
        .trim()
        .toLowerCase();

}


// ==========================================================
// CALCULATE PAYMENT TOTALS
// ==========================================================

function calculatePaymentTotals() {

    let totalSales = 0;

    let cashSales = 0;

    let cardSales = 0;

    let onlineSales = 0;

    let otherSales = 0;


    salesData.forEach((sale) => {

        const amount =
            Number(sale.amount) || 0;

        const payment =
            getPaymentMethod(sale);


        totalSales += amount;


        // CASH

        if (
            payment === "cash"
        ) {

            cashSales += amount;

        }


        // CARD

        else if (
            payment === "card" ||
            payment === "credit card" ||
            payment === "debit card"
        ) {

            cardSales += amount;

        }


        // ONLINE

        else if (
            payment === "online" ||
            payment === "esewa" ||
            payment === "e-sewa" ||
            payment === "khalti" ||
            payment === "fonepay" ||
            payment === "bank" ||
            payment === "online payment"
        ) {

            onlineSales += amount;

        }


        // OTHER

        else {

            otherSales += amount;

        }

    });


    return {

        totalSales,
        cashSales,
        cardSales,
        onlineSales,
        otherSales

    };

}


// ==========================================================
// UPDATE DASHBOARD CARDS
// ==========================================================

function updateDashboardCards() {

    const totals =
        calculatePaymentTotals();


    // TOTAL SALES

    if (dashboardSales) {

        dashboardSales.textContent =
            formatCurrency(
                totals.totalSales
            );

    }


    // CASH SALES

    if (dashboardCashSales) {

        dashboardCashSales.textContent =
            formatCurrency(
                totals.cashSales
            );

    }


    // CARD SALES

    if (dashboardCardSales) {

        dashboardCardSales.textContent =
            formatCurrency(
                totals.cardSales
            );

    }


    // ONLINE SALES

    if (dashboardOnlineSales) {

        dashboardOnlineSales.textContent =
            formatCurrency(
                totals.onlineSales
            );

    }


    // OTHER SALES

    if (dashboardOtherSales) {

        dashboardOtherSales.textContent =
            formatCurrency(
                totals.otherSales
            );

    }


    // TRANSACTIONS

    if (dashboardTransactions) {

        dashboardTransactions.textContent =
            salesData.length;

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


    // UPDATE PETROL

    updateFuelItem(
        "petrol",
        petrol,
        5000
    );


    // UPDATE DIESEL

    updateFuelItem(
        "diesel",
        diesel,
        5000
    );


    // UPDATE PREMIUM

    updateFuelItem(
        "premium",
        premium,
        3000
    );


    // TOTAL CURRENT STOCK

    const totalStock =
        petrol +
        diesel +
        premium;


    if (dashboardFuelStock) {

        dashboardFuelStock.textContent =
            totalStock.toLocaleString() +
            " L";

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


    // PETROL

    if (fuel === "petrol") {

        stockElement =
            petrolStock;

        progressElement =
            petrolProgress;

        percentageElement =
            petrolPercentage;

        statusElement =
            petrolStatus;

        itemElement =
            petrolFuelItem;

    }


    // DIESEL

    else if (fuel === "diesel") {

        stockElement =
            dieselStock;

        progressElement =
            dieselProgress;

        percentageElement =
            dieselPercentage;

        statusElement =
            dieselStatus;

        itemElement =
            dieselFuelItem;

    }


    // PREMIUM

    else if (fuel === "premium") {

        stockElement =
            premiumStock;

        progressElement =
            premiumProgress;

        percentageElement =
            premiumPercentage;

        statusElement =
            premiumStatus;

        itemElement =
            premiumFuelItem;

    }


    if (!stockElement) {

        return;

    }


    // CALCULATE PERCENTAGE

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


    // STOCK TEXT

    stockElement.textContent =
        stock.toLocaleString() +
        " L";


    // PROGRESS BAR

    if (progressElement) {

        progressElement.style.width =
            percentage + "%";

    }


    // PERCENTAGE

    if (percentageElement) {

        percentageElement.textContent =
            Math.round(percentage) +
            "%";

    }


    // RESET STATES

    if (itemElement) {

        itemElement.classList.remove(
            "low-stock",
            "critical-stock"
        );

    }


    // STATUS

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


    // LAST 7 DAYS

    for (
        let i = 6;
        i >= 0;
        i--
    ) {

        const date =
            new Date();


        date.setHours(
            0,
            0,
            0,
            0
        );


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


    // CALCULATE DAILY SALES

    salesData.forEach((sale) => {

        const saleDate =
            new Date(
                sale.date ||
                sale.timestamp
            );


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
                Number(
                    sale.amount
                ) || 0;

        }

    });


    // DESTROY OLD CHART

    if (salesChart) {

        salesChart.destroy();

    }


    // CREATE CHART

    salesChart =
        new Chart(
            salesChartCanvas,
            {

                type: "line",


                data: {

                    labels: labels,

                    datasets: [

                        {

                            label:
                                "Daily Sales",

                            data:
                                totals,

                            borderColor:
                                "#2563eb",

                            backgroundColor:
                                "rgba(37, 99, 235, 0.10)",

                            borderWidth: 3,

                            fill: true,

                            tension: 0.4,

                            pointRadius: 4,

                            pointHoverRadius: 7

                        }

                    ]

                },


                options: {

                    responsive: true,

                    maintainAspectRatio:
                        false,


                    plugins: {

                        legend: {

                            display:
                                false

                        }

                    },


                    scales: {

                        x: {

                            grid: {

                                display:
                                    false

                            }

                        },


                        y: {

                            beginAtZero:
                                true,

                            grid: {

                                color:
                                    "#eef2f7"

                            },


                            ticks: {

                                callback:
                                    function (
                                        value
                                    ) {

                                        return (
                                            "Rs. " +
                                            Number(
                                                value
                                            ).toLocaleString()
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

            dateStyle:
                "short",

            timeStyle:
                "short"

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


    recentTransactions.innerHTML =
        "";


    // EMPTY STATE

    if (
        salesData.length === 0
    ) {

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


    // LATEST 10 SALES

    const latestSales =
        [...salesData]
            .reverse()
            .slice(0, 10);


    latestSales.forEach(
        (sale, index) => {


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
                String(status)
                    .toLowerCase()
                    .replace(
                        /\s+/g,
                        "-"
                    );


            const dateText =
                formatTransactionDate(
                    sale
                );


            // CREATE ROW

            const row =
                document.createElement(
                    "tr"
                );


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

        }
    );

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
                ) === String(
                    invoice
                );

            }
        );


    if (!transaction) {

        alert(
            "Transaction details not found."
        );

        return;

    }


    localStorage.setItem(
        "selectedTransaction",
        JSON.stringify(
            transaction
        )
    );


    window.location.href =
        "sales.html";

}


// ==========================================================
// INITIALIZE DASHBOARD
// ==========================================================

function initializeDashboard() {

    // Reload latest sales

    salesData =
        JSON.parse(
            localStorage.getItem("sales")
        ) || [];


    // Update payment cards

    updateDashboardCards();


    // Update inventory

    updateDashboardInventory();


    // Update chart

    loadSalesChart();


    // Update recent transactions

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