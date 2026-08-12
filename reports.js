// ==========================================
// FuelFlow Reports Module
// Complete reports.js
// ==========================================



// ==========================================
// DOM ELEMENTS
// ==========================================

const reportPeriod =
    document.getElementById("reportPeriod");

const reportDateText =
    document.getElementById("reportDateText");

const refreshReports =
    document.getElementById("refreshReports");

const printReport =
    document.getElementById("printReport");


// Summary

const reportTotalSales =
    document.getElementById("reportTotalSales");

const reportTotalExpenses =
    document.getElementById("reportTotalExpenses");

const reportNetProfit =
    document.getElementById("reportNetProfit");

const reportTransactions =
    document.getElementById("reportTransactions");


// Fuel

const reportPetrolLitres =
    document.getElementById("reportPetrolLitres");

const reportDieselLitres =
    document.getElementById("reportDieselLitres");

const reportPetrolSales =
    document.getElementById("reportPetrolSales");

const reportDieselSales =
    document.getElementById("reportDieselSales");

const petrolReportBar =
    document.getElementById("petrolReportBar");

const dieselReportBar =
    document.getElementById("dieselReportBar");


// Sales Overview

const overviewTransactions =
    document.getElementById("overviewTransactions");

const overviewFuelSold =
    document.getElementById("overviewFuelSold");

const averageTransaction =
    document.getElementById("averageTransaction");

const overviewPetrolSales =
    document.getElementById("overviewPetrolSales");

const overviewDieselSales =
    document.getElementById("overviewDieselSales");


// Expense

const expenseBreakdown =
    document.getElementById("expenseBreakdown");


// Inventory

const reportPetrolStock =
    document.getElementById("reportPetrolStock");

const reportDieselStock =
    document.getElementById("reportDieselStock");

const reportTotalStock =
    document.getElementById("reportTotalStock");


// Customers

const reportTotalCustomers =
    document.getElementById("reportTotalCustomers");

const reportRegularCustomers =
    document.getElementById("reportRegularCustomers");

const reportRegisteredVehicles =
    document.getElementById("reportRegisteredVehicles");


// Recent Sales

const reportSalesTableBody =
    document.getElementById("reportSalesTableBody");


// Footer

const reportGeneratedText =
    document.getElementById("reportGeneratedText");



// ==========================================
// LOAD DATA FROM LOCAL STORAGE
// ==========================================

function getStorageData(key, defaultValue = []) {

    try {

        const data =
            localStorage.getItem(key);

        if (
            !data ||
            data === "undefined" ||
            data === "null"
        ) {

            return defaultValue;

        }

        return JSON.parse(data);

    }

    catch (error) {

        console.error(
            `Error loading ${key}:`,
            error
        );

        return defaultValue;

    }

}



// ==========================================
// LOAD SALES
// ==========================================

function getSalesData() {

    return getStorageData(
        "sales",
        []
    );

}



// ==========================================
// LOAD EXPENSES
// ==========================================

function getExpensesData() {

    return getStorageData(
        "expenses",
        []
    );

}



// ==========================================
// LOAD CUSTOMERS
// ==========================================

function getCustomersData() {

    return getStorageData(
        "customers",
        []
    );

}



// ==========================================
// LOAD FUEL STOCK
// ==========================================

function getFuelStockData() {

    return getStorageData(
        "fuelStock",
        {
            petrol: 0,
            diesel: 0
        }
    );

}



// ==========================================
// NUMBER FORMAT
// ==========================================

function formatNumber(number) {

    return Number(number || 0)
        .toLocaleString("en-IN");

}



// ==========================================
// CURRENCY FORMAT
// ==========================================

function formatCurrency(number) {

    return "Rs. " + formatNumber(number);

}



// ==========================================
// DATE PARSER
// ==========================================

function parseDate(value) {

    if (!value) {

        return null;

    }


    const date =
        new Date(value);


    if (!isNaN(date.getTime())) {

        return date;

    }


    return null;

}



// ==========================================
// CHECK SALES DATE
// ==========================================

function isSaleInPeriod(
    sale,
    period
) {

    const saleDate =
        parseDate(sale.date);


    if (!saleDate) {

        return true;

    }


    const now =
        new Date();


    const today =
        new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
        );


    // ------------------------------
    // Today
    // ------------------------------

    if (period === "today") {

        return (

            saleDate.getFullYear()
                === today.getFullYear()

            &&

            saleDate.getMonth()
                === today.getMonth()

            &&

            saleDate.getDate()
                === today.getDate()

        );

    }


    // ------------------------------
    // This Week
    // ------------------------------

    if (period === "week") {

        const day =
            today.getDay();

        const difference =
            day === 0 ? 6 : day - 1;

        const weekStart =
            new Date(today);

        weekStart.setDate(
            today.getDate() - difference
        );

        return saleDate >= weekStart;

    }


    // ------------------------------
    // This Month
    // ------------------------------

    if (period === "month") {

        return (

            saleDate.getFullYear()
                === today.getFullYear()

            &&

            saleDate.getMonth()
                === today.getMonth()

        );

    }


    // ------------------------------
    // This Year
    // ------------------------------

    if (period === "year") {

        return (

            saleDate.getFullYear()
                === today.getFullYear()

        );

    }


    // ------------------------------
    // All Time
    // ------------------------------

    return true;

}



// ==========================================
// CHECK EXPENSE DATE
// ==========================================

function isExpenseInPeriod(
    expense,
    period
) {

    const dateValue =
        expense.date ||
        expense.createdAt ||
        expense.expenseDate;


    const expenseDate =
        parseDate(dateValue);


    if (!expenseDate) {

        return true;

    }


    const now =
        new Date();


    const today =
        new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
        );


    // Today

    if (period === "today") {

        return (

            expenseDate.getFullYear()
                === today.getFullYear()

            &&

            expenseDate.getMonth()
                === today.getMonth()

            &&

            expenseDate.getDate()
                === today.getDate()

        );

    }


    // Week

    if (period === "week") {

        const day =
            today.getDay();

        const difference =
            day === 0 ? 6 : day - 1;

        const weekStart =
            new Date(today);

        weekStart.setDate(
            today.getDate() - difference
        );

        return expenseDate >= weekStart;

    }


    // Month

    if (period === "month") {

        return (

            expenseDate.getFullYear()
                === today.getFullYear()

            &&

            expenseDate.getMonth()
                === today.getMonth()

        );

    }


    // Year

    if (period === "year") {

        return (

            expenseDate.getFullYear()
                === today.getFullYear()

        );

    }


    return true;

}



// ==========================================
// GET EXPENSE AMOUNT
// ==========================================

function getExpenseAmount(expense) {

    return Number(

        expense.amount ??
        expense.total ??
        expense.cost ??
        0

    );

}



// ==========================================
// GET SALE AMOUNT
// ==========================================

function getSaleAmount(sale) {

    return Number(

        sale.amount ??
        sale.total ??
        0

    );

}



// ==========================================
// GET SALE QUANTITY
// ==========================================

function getSaleQuantity(sale) {

    return Number(

        sale.quantity ??
        sale.litres ??
        sale.qty ??
        0

    );

}



// ==========================================
// UPDATE DATE TEXT
// ==========================================

function updateReportDateText() {

    const period =
        reportPeriod.value;


    const now =
        new Date();


    if (period === "today") {

        reportDateText.textContent =
            now.toLocaleDateString(
                "en-US",
                {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                }
            );

        return;

    }


    if (period === "week") {

        reportDateText.textContent =
            "Current Week";

        return;

    }


    if (period === "month") {

        reportDateText.textContent =
            now.toLocaleDateString(
                "en-US",
                {
                    month: "long",
                    year: "numeric"
                }
            );

        return;

    }


    if (period === "year") {

        reportDateText.textContent =
            String(
                now.getFullYear()
            );

        return;

    }


    reportDateText.textContent =
        "All Recorded Data";

}



// ==========================================
// CALCULATE REPORT
// ==========================================

function generateReport() {


    const period =
        reportPeriod.value;


    const allSales =
        getSalesData();


    const allExpenses =
        getExpensesData();


    const customers =
        getCustomersData();


    const fuelStock =
        getFuelStockData();



    // ======================================
    // FILTER SALES
    // ======================================

    const filteredSales =
        allSales.filter(
            sale =>
                isSaleInPeriod(
                    sale,
                    period
                )
        );



    // ======================================
    // FILTER EXPENSES
    // ======================================

    const filteredExpenses =
        allExpenses.filter(
            expense =>
                isExpenseInPeriod(
                    expense,
                    period
                )
        );



    // ======================================
    // SALES CALCULATION
    // ======================================

    let totalSales = 0;

    let totalFuel = 0;

    let petrolLitres = 0;

    let dieselLitres = 0;

    let petrolSales = 0;

    let dieselSales = 0;



    filteredSales.forEach(
        sale => {

            const amount =
                getSaleAmount(sale);

            const litres =
                getSaleQuantity(sale);


            totalSales += amount;

            totalFuel += litres;


            const fuel =
                String(
                    sale.fuel || ""
                ).toLowerCase();


            if (fuel === "petrol") {

                petrolLitres += litres;

                petrolSales += amount;

            }


            else if (fuel === "diesel") {

                dieselLitres += litres;

                dieselSales += amount;

            }

        }
    );



    // ======================================
    // EXPENSE CALCULATION
    // ======================================

    let totalExpenses = 0;


    filteredExpenses.forEach(
        expense => {

            totalExpenses +=
                getExpenseAmount(
                    expense
                );

        }
    );



    // ======================================
    // PROFIT
    // ======================================

    const netProfit =
        totalSales -
        totalExpenses;



    // ======================================
    // TRANSACTIONS
    // ======================================

    const transactions =
        filteredSales.length;



    // ======================================
    // UPDATE SUMMARY
    // ======================================

    reportTotalSales.textContent =
        formatCurrency(
            totalSales
        );


    reportTotalExpenses.textContent =
        formatCurrency(
            totalExpenses
        );


    reportNetProfit.textContent =
        formatCurrency(
            netProfit
        );


    reportTransactions.textContent =
        formatNumber(
            transactions
        );



    // ======================================
    // PROFIT COLOR
    // ======================================

    if (netProfit < 0) {

        reportNetProfit.style.color =
            "#dc2626";

    }

    else {

        reportNetProfit.style.color =
            "#16a34a";

    }



    // ======================================
    // FUEL REPORT
    // ======================================

    reportPetrolLitres.textContent =
        formatNumber(
            petrolLitres
        ) + " L";


    reportDieselLitres.textContent =
        formatNumber(
            dieselLitres
        ) + " L";


    reportPetrolSales.textContent =
        formatCurrency(
            petrolSales
        );


    reportDieselSales.textContent =
        formatCurrency(
            dieselSales
        );



    // ======================================
    // FUEL PROGRESS
    // ======================================

    const totalFuelSales =
        petrolLitres +
        dieselLitres;


    let petrolPercentage = 0;

    let dieselPercentage = 0;


    if (totalFuelSales > 0) {

        petrolPercentage =
            (
                petrolLitres /
                totalFuelSales
            ) * 100;


        dieselPercentage =
            (
                dieselLitres /
                totalFuelSales
            ) * 100;

    }


    petrolReportBar.style.width =
        petrolPercentage + "%";


    dieselReportBar.style.width =
        dieselPercentage + "%";



    // ======================================
    // SALES OVERVIEW
    // ======================================

    overviewTransactions.textContent =
        formatNumber(
            transactions
        );


    overviewFuelSold.textContent =
        formatNumber(
            totalFuel
        ) + " L";


    const average =
        transactions > 0
            ? totalSales / transactions
            : 0;


    averageTransaction.textContent =
        formatCurrency(
            average.toFixed(2)
        );


    overviewPetrolSales.textContent =
        formatCurrency(
            petrolSales
        );


    overviewDieselSales.textContent =
        formatCurrency(
            dieselSales
        );



    // ======================================
    // INVENTORY
    // ======================================

    const petrolStock =
        Number(
            fuelStock.petrol || 0
        );


    const dieselStock =
        Number(
            fuelStock.diesel || 0
        );


    reportPetrolStock.textContent =
        formatNumber(
            petrolStock
        ) + " L";


    reportDieselStock.textContent =
        formatNumber(
            dieselStock
        ) + " L";


    reportTotalStock.textContent =
        formatNumber(
            petrolStock +
            dieselStock
        ) + " L";



    // ======================================
    // CUSTOMERS
    // ======================================

    const customerList =
        Array.isArray(customers)
            ? customers
            : [];


    reportTotalCustomers.textContent =
        formatNumber(
            customerList.length
        );


    let regularCustomers = 0;

    let vehicles = 0;


    customerList.forEach(
        customer => {

            const visits =
                Number(

                    customer.visits ??
                    customer.totalVisits ??
                    customer.transactions ??
                    0

                );


            if (visits > 1) {

                regularCustomers++;

            }


            if (

                customer.vehicle ||
                customer.vehicleNumber ||
                customer.vehicles

            ) {

                vehicles++;

            }

        }
    );


    reportRegularCustomers.textContent =
        formatNumber(
            regularCustomers
        );


    reportRegisteredVehicles.textContent =
        formatNumber(
            vehicles
        );



    // ======================================
    // EXPENSE BREAKDOWN
    // ======================================

    generateExpenseBreakdown(
        filteredExpenses,
        totalExpenses
    );



    // ======================================
    // RECENT SALES
    // ======================================

    displayRecentSales(
        filteredSales
    );



    // ======================================
    // GENERATED TIME
    // ======================================

    const currentTime =
        new Date().toLocaleString();


    reportGeneratedText.textContent =
        `Report generated on ${currentTime}`;

}



// ==========================================
// EXPENSE BREAKDOWN
// ==========================================

function generateExpenseBreakdown(
    expenses,
    totalExpenses
) {


    if (!expenseBreakdown) {

        return;

    }


    expenseBreakdown.innerHTML = "";



    if (
        !expenses ||
        expenses.length === 0
    ) {

        expenseBreakdown.innerHTML = `

            <div class="empty-report-message">

                No expense data available.

            </div>

        `;

        return;

    }



    const categories = {};



    expenses.forEach(
        expense => {

            const category =

                expense.category ||

                expense.type ||

                expense.name ||

                "Other";


            const amount =
                getExpenseAmount(
                    expense
                );


            if (!categories[category]) {

                categories[category] = 0;

            }


            categories[category] +=
                amount;

        }
    );



    const sortedCategories =
        Object.entries(
            categories
        )
        .sort(
            (a,b) =>
                b[1] - a[1]
        );



    sortedCategories.forEach(
        ([category, amount]) => {


            const percentage =
                totalExpenses > 0

                    ? (
                        amount /
                        totalExpenses
                    ) * 100

                    : 0;



            expenseBreakdown.innerHTML += `

                <div class="expense-breakdown-row">


                    <div class="expense-breakdown-info">

                        <span
                            class="expense-breakdown-dot"
                        ></span>

                        <span>
                            ${category}
                        </span>

                    </div>


                    <div class="expense-breakdown-bar">

                        <div
                            class="expense-breakdown-fill"
                            style="width:${percentage}%"
                        ></div>

                    </div>


                    <span class="expense-breakdown-amount">

                        ${formatCurrency(amount)}

                    </span>


                </div>

            `;

        }
    );

}



// ==========================================
// DISPLAY RECENT SALES
// ==========================================

function displayRecentSales(
    sales
) {


    if (!reportSalesTableBody) {

        return;

    }


    reportSalesTableBody.innerHTML = "";



    if (
        !sales ||
        sales.length === 0
    ) {

        reportSalesTableBody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="empty-report-message"
                >

                    No sales data available.

                </td>

            </tr>

        `;

        return;

    }



    // Latest sales first

    const recentSales =
        sales
        .slice()
        .reverse()
        .slice(0,10);



    recentSales.forEach(
        sale => {


            const fuel =
                String(
                    sale.fuel || "-"
                );


            const fuelClass =
                fuel.toLowerCase()
                    === "petrol"

                    ? "report-fuel-petrol"

                    : "report-fuel-diesel";



            const payment =
                sale.payment ||
                "-";



            reportSalesTableBody.innerHTML += `

                <tr>


                    <td>

                        <strong>
                            ${sale.invoice || "-"}
                        </strong>

                    </td>


                    <td>

                        ${sale.customer || "-"}

                    </td>


                    <td>

                        <span
                            class="report-fuel-badge ${fuelClass}"
                        >

                            ${fuel}

                        </span>

                    </td>


                    <td>

                        ${formatNumber(
                            getSaleQuantity(sale)
                        )} L

                    </td>


                    <td>

                        <strong>

                            ${formatCurrency(
                                getSaleAmount(sale)
                            )}

                        </strong>

                    </td>


                    <td>

                        <span
                            class="report-payment-badge"
                        >

                            ${payment}

                        </span>

                    </td>


                    <td>

                        ${sale.date || "-"}

                    </td>


                </tr>

            `;

        }
    );

}



// ==========================================
// REFRESH REPORT
// ==========================================

function refreshReportData() {

    updateReportDateText();

    generateReport();

}



// ==========================================
// PERIOD CHANGE
// ==========================================

if (reportPeriod) {

    reportPeriod.addEventListener(
        "change",
        () => {

            refreshReportData();

        }
    );

}



// ==========================================
// REFRESH BUTTON
// ==========================================

if (refreshReports) {

    refreshReports.addEventListener(
        "click",
        () => {

            refreshReportData();

        }
    );

}



// ==========================================
// PRINT REPORT
// ==========================================

if (printReport) {

    printReport.addEventListener(
        "click",
        () => {

            window.print();

        }
    );

}



// ==========================================
// AUTO REFRESH
// ==========================================

setInterval(
    () => {

        generateReport();

    },
    5000
);



// ==========================================
// INITIALIZE
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateReportDateText();

        generateReport();

    }
);