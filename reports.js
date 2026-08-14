// ======================================================
// FuelFlow Reports Module
// Complete Reports JavaScript
// ======================================================


// ======================================================
// DOM ELEMENTS
// ======================================================

// Report controls
const reportPeriod =
    document.getElementById("reportPeriod");

const reportDate =
    document.getElementById("reportDate");

const clearReportDate =
    document.getElementById("clearReportDate");

const reportDateText =
    document.getElementById("reportDateText");

const refreshReports =
    document.getElementById("refreshReports");

const printReport =
    document.getElementById("printReport");


// ======================================================
// SUMMARY
// ======================================================

const reportTotalSales =
    document.getElementById("reportTotalSales");

const reportTotalExpenses =
    document.getElementById("reportTotalExpenses");

const reportNetProfit =
    document.getElementById("reportNetProfit");

const reportTransactions =
    document.getElementById("reportTransactions");


// ======================================================
// FUEL
// ======================================================

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


// ======================================================
// SALES OVERVIEW
// ======================================================

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


// ======================================================
// EXPENSES
// ======================================================

const expenseBreakdown =
    document.getElementById("expenseBreakdown");


// ======================================================
// INVENTORY
// ======================================================

const reportPetrolStock =
    document.getElementById("reportPetrolStock");

const reportDieselStock =
    document.getElementById("reportDieselStock");

const reportTotalStock =
    document.getElementById("reportTotalStock");


// ======================================================
// CUSTOMERS
// ======================================================

const reportTotalCustomers =
    document.getElementById("reportTotalCustomers");

const reportRegularCustomers =
    document.getElementById("reportRegularCustomers");

const reportRegisteredVehicles =
    document.getElementById("reportRegisteredVehicles");


// ======================================================
// RECENT SALES
// ======================================================

const reportSalesTableBody =
    document.getElementById("reportSalesTableBody");


// ======================================================
// FOOTER
// ======================================================

const reportGeneratedText =
    document.getElementById("reportGeneratedText");


// ======================================================
// LOCAL STORAGE HELPER
// ======================================================

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
            `FuelFlow: Error loading ${key}`,
            error
        );

        return defaultValue;

    }

}


// ======================================================
// LOAD SALES
// ======================================================

function getSalesData() {

    const sales =
        getStorageData("sales", []);

    return Array.isArray(sales)
        ? sales
        : [];

}


// ======================================================
// LOAD EXPENSES
// ======================================================

function getExpensesData() {

    const expenses =
        getStorageData("expenses", []);

    return Array.isArray(expenses)
        ? expenses
        : [];

}


// ======================================================
// LOAD CUSTOMERS
// ======================================================

function getCustomersData() {

    const customers =
        getStorageData("customers", []);

    return Array.isArray(customers)
        ? customers
        : [];

}


// ======================================================
// LOAD FUEL STOCK
// ======================================================

function getFuelStockData() {

    const stock =
        getStorageData(
            "fuelStock",
            {
                petrol: 0,
                diesel: 0
            }
        );

    if (
        !stock ||
        typeof stock !== "object" ||
        Array.isArray(stock)
    ) {

        return {
            petrol: 0,
            diesel: 0
        };

    }

    return stock;

}


// ======================================================
// NUMBER FORMAT
// ======================================================

function formatNumber(number) {

    const value =
        Number(number) || 0;

    return value.toLocaleString("en-IN");

}


// ======================================================
// CURRENCY FORMAT
// ======================================================

function formatCurrency(number) {

    const value =
        Number(number) || 0;

    return (
        "Rs. " +
        value.toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            }
        )
    );

}


// ======================================================
// DATE PARSER
// ======================================================

function parseDate(value) {

    if (!value) {

        return null;

    }

    const date =
        new Date(value);

    if (
        !isNaN(date.getTime())
    ) {

        return date;

    }

    return null;

}


// ======================================================
// GET DATE FROM SALE
// ======================================================

function getSaleDateValue(sale) {

    return (
        sale.date ||
        sale.createdAt ||
        sale.saleDate ||
        sale.transactionDate ||
        null
    );

}


// ======================================================
// GET DATE FROM EXPENSE
// ======================================================

function getExpenseDateValue(expense) {

    return (
        expense.date ||
        expense.createdAt ||
        expense.expenseDate ||
        expense.transactionDate ||
        null
    );

}


// ======================================================
// CHECK SAME DAY
// ======================================================

function isSameDay(date1, date2) {

    if (
        !date1 ||
        !date2
    ) {

        return false;

    }

    return (

        date1.getFullYear() ===
        date2.getFullYear()

        &&

        date1.getMonth() ===
        date2.getMonth()

        &&

        date1.getDate() ===
        date2.getDate()

    );

}


// ======================================================
// GET START OF TODAY
// ======================================================

function getToday() {

    const now =
        new Date();

    return new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
    );

}


// ======================================================
// CHECK SALE PERIOD
// ======================================================

function isSaleInPeriod(
    sale,
    period
) {

    const saleDate =
        parseDate(
            getSaleDateValue(sale)
        );


    // --------------------------------------------------
    // If user selected an exact date
    // exact date overrides period
    // --------------------------------------------------

    const selectedDate =
        reportDate &&
        reportDate.value
            ? parseDate(reportDate.value)
            : null;


    if (selectedDate) {

        if (!saleDate) {

            return false;

        }

        return isSameDay(
            saleDate,
            selectedDate
        );

    }


    // --------------------------------------------------
    // If sale has no valid date
    // --------------------------------------------------

    if (!saleDate) {

        return true;

    }


    const today =
        getToday();


    // --------------------------------------------------
    // TODAY
    // --------------------------------------------------

    if (period === "today") {

        return isSameDay(
            saleDate,
            today
        );

    }


    // --------------------------------------------------
    // THIS WEEK
    // Monday -> Sunday
    // --------------------------------------------------

    if (period === "week") {

        const day =
            today.getDay();

        const difference =
            day === 0
                ? 6
                : day - 1;

        const weekStart =
            new Date(today);

        weekStart.setDate(
            today.getDate() - difference
        );

        weekStart.setHours(
            0,
            0,
            0,
            0
        );


        const weekEnd =
            new Date(weekStart);

        weekEnd.setDate(
            weekStart.getDate() + 7
        );


        return (
            saleDate >= weekStart &&
            saleDate < weekEnd
        );

    }


    // --------------------------------------------------
    // THIS MONTH
    // --------------------------------------------------

    if (period === "month") {

        return (

            saleDate.getFullYear() ===
            today.getFullYear()

            &&

            saleDate.getMonth() ===
            today.getMonth()

        );

    }


    // --------------------------------------------------
    // THIS YEAR
    // --------------------------------------------------

    if (period === "year") {

        return (

            saleDate.getFullYear() ===
            today.getFullYear()

        );

    }


    // --------------------------------------------------
    // ALL TIME
    // --------------------------------------------------

    return true;

}


// ======================================================
// CHECK EXPENSE PERIOD
// ======================================================

function isExpenseInPeriod(
    expense,
    period
) {

    const expenseDate =
        parseDate(
            getExpenseDateValue(expense)
        );


    // --------------------------------------------------
    // Exact date selected
    // --------------------------------------------------

    const selectedDate =
        reportDate &&
        reportDate.value
            ? parseDate(reportDate.value)
            : null;


    if (selectedDate) {

        if (!expenseDate) {

            return false;

        }

        return isSameDay(
            expenseDate,
            selectedDate
        );

    }


    // --------------------------------------------------
    // No valid date
    // --------------------------------------------------

    if (!expenseDate) {

        return true;

    }


    const today =
        getToday();


    // --------------------------------------------------
    // TODAY
    // --------------------------------------------------

    if (period === "today") {

        return isSameDay(
            expenseDate,
            today
        );

    }


    // --------------------------------------------------
    // THIS WEEK
    // --------------------------------------------------

    if (period === "week") {

        const day =
            today.getDay();

        const difference =
            day === 0
                ? 6
                : day - 1;

        const weekStart =
            new Date(today);

        weekStart.setDate(
            today.getDate() - difference
        );

        weekStart.setHours(
            0,
            0,
            0,
            0
        );


        const weekEnd =
            new Date(weekStart);

        weekEnd.setDate(
            weekStart.getDate() + 7
        );


        return (
            expenseDate >= weekStart &&
            expenseDate < weekEnd
        );

    }


    // --------------------------------------------------
    // THIS MONTH
    // --------------------------------------------------

    if (period === "month") {

        return (

            expenseDate.getFullYear() ===
            today.getFullYear()

            &&

            expenseDate.getMonth() ===
            today.getMonth()

        );

    }


    // --------------------------------------------------
    // THIS YEAR
    // --------------------------------------------------

    if (period === "year") {

        return (

            expenseDate.getFullYear() ===
            today.getFullYear()

        );

    }


    // --------------------------------------------------
    // ALL TIME
    // --------------------------------------------------

    return true;

}


// ======================================================
// GET EXPENSE AMOUNT
// ======================================================

function getExpenseAmount(expense) {

    return Number(

        expense.amount ??
        expense.total ??
        expense.cost ??
        0

    ) || 0;

}


// ======================================================
// GET SALE AMOUNT
// ======================================================

function getSaleAmount(sale) {

    return Number(

        sale.amount ??
        sale.total ??
        sale.totalAmount ??
        0

    ) || 0;

}


// ======================================================
// GET SALE QUANTITY
// ======================================================

function getSaleQuantity(sale) {

    return Number(

        sale.quantity ??
        sale.litres ??
        sale.qty ??
        sale.volume ??
        0

    ) || 0;

}


// ======================================================
// GET FUEL TYPE
// ======================================================

function getFuelType(sale) {

    return String(

        sale.fuel ??
        sale.fuelType ??
        sale.product ??
        ""

    )
        .trim()
        .toLowerCase();

}


// ======================================================
// UPDATE REPORT DATE TEXT
// ======================================================

function updateReportDateText() {

    if (!reportDateText) {

        return;

    }


    const period =
        reportPeriod
            ? reportPeriod.value
            : "month";


    // --------------------------------------------------
    // Exact date
    // --------------------------------------------------

    if (
        reportDate &&
        reportDate.value
    ) {

        const selectedDate =
            parseDate(
                reportDate.value
            );


        if (selectedDate) {

            reportDateText.textContent =
                selectedDate.toLocaleDateString(
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

    }


    const now =
        new Date();


    // --------------------------------------------------
    // TODAY
    // --------------------------------------------------

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


    // --------------------------------------------------
    // WEEK
    // --------------------------------------------------

    if (period === "week") {

        reportDateText.textContent =
            "Current Week";

        return;

    }


    // --------------------------------------------------
    // MONTH
    // --------------------------------------------------

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


    // --------------------------------------------------
    // YEAR
    // --------------------------------------------------

    if (period === "year") {

        reportDateText.textContent =
            String(
                now.getFullYear()
            );

        return;

    }


    // --------------------------------------------------
    // ALL TIME
    // --------------------------------------------------

    reportDateText.textContent =
        "All Recorded Data";

}


// ======================================================
// GENERATE REPORT
// ======================================================

function generateReport() {

    const period =
        reportPeriod
            ? reportPeriod.value
            : "month";


    // --------------------------------------------------
    // LOAD DATA
    // --------------------------------------------------

    const allSales =
        getSalesData();

    const allExpenses =
        getExpensesData();

    const customers =
        getCustomersData();

    const fuelStock =
        getFuelStockData();


    // --------------------------------------------------
    // FILTER SALES
    // --------------------------------------------------

    const filteredSales =
        allSales.filter(
            sale =>
                isSaleInPeriod(
                    sale,
                    period
                )
        );


    // --------------------------------------------------
    // FILTER EXPENSES
    // --------------------------------------------------

    const filteredExpenses =
        allExpenses.filter(
            expense =>
                isExpenseInPeriod(
                    expense,
                    period
                )
        );


    // ==================================================
    // SALES CALCULATION
    // ==================================================

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

            const fuel =
                getFuelType(sale);


            totalSales += amount;

            totalFuel += litres;


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


    // ==================================================
    // EXPENSE CALCULATION
    // ==================================================

    let totalExpenses = 0;


    filteredExpenses.forEach(
        expense => {

            totalExpenses +=
                getExpenseAmount(
                    expense
                );

        }
    );


    // ==================================================
    // PROFIT
    // ==================================================

    const netProfit =
        totalSales -
        totalExpenses;


    // ==================================================
    // TRANSACTIONS
    // ==================================================

    const transactions =
        filteredSales.length;


    // ==================================================
    // SUMMARY
    // ==================================================

    if (reportTotalSales) {

        reportTotalSales.textContent =
            formatCurrency(
                totalSales
            );

    }


    if (reportTotalExpenses) {

        reportTotalExpenses.textContent =
            formatCurrency(
                totalExpenses
            );

    }


    if (reportNetProfit) {

        reportNetProfit.textContent =
            formatCurrency(
                netProfit
            );


        reportNetProfit.style.color =
            netProfit < 0
                ? "#dc2626"
                : "#16a34a";

    }


    if (reportTransactions) {

        reportTransactions.textContent =
            formatNumber(
                transactions
            );

    }


    // ==================================================
    // FUEL PERFORMANCE
    // ==================================================

    if (reportPetrolLitres) {

        reportPetrolLitres.textContent =
            formatNumber(
                petrolLitres
            ) + " L";

    }


    if (reportDieselLitres) {

        reportDieselLitres.textContent =
            formatNumber(
                dieselLitres
            ) + " L";

    }


    if (reportPetrolSales) {

        reportPetrolSales.textContent =
            formatCurrency(
                petrolSales
            );

    }


    if (reportDieselSales) {

        reportDieselSales.textContent =
            formatCurrency(
                dieselSales
            );

    }


    // ==================================================
    // FUEL PROGRESS
    // ==================================================

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


    if (petrolReportBar) {

        petrolReportBar.style.width =
            petrolPercentage + "%";

    }


    if (dieselReportBar) {

        dieselReportBar.style.width =
            dieselPercentage + "%";

    }


    // ==================================================
    // SALES OVERVIEW
    // ==================================================

    if (overviewTransactions) {

        overviewTransactions.textContent =
            formatNumber(
                transactions
            );

    }


    if (overviewFuelSold) {

        overviewFuelSold.textContent =
            formatNumber(
                totalFuel
            ) + " L";

    }


    const average =
        transactions > 0
            ? totalSales / transactions
            : 0;


    if (averageTransaction) {

        averageTransaction.textContent =
            formatCurrency(
                average
            );

    }


    if (overviewPetrolSales) {

        overviewPetrolSales.textContent =
            formatCurrency(
                petrolSales
            );

    }


    if (overviewDieselSales) {

        overviewDieselSales.textContent =
            formatCurrency(
                dieselSales
            );

    }


    // ==================================================
    // INVENTORY
    // ==================================================

    const petrolStock =
        Number(
            fuelStock.petrol
        ) || 0;


    const dieselStock =
        Number(
            fuelStock.diesel
        ) || 0;


    if (reportPetrolStock) {

        reportPetrolStock.textContent =
            formatNumber(
                petrolStock
            ) + " L";

    }


    if (reportDieselStock) {

        reportDieselStock.textContent =
            formatNumber(
                dieselStock
            ) + " L";

    }


    if (reportTotalStock) {

        reportTotalStock.textContent =
            formatNumber(
                petrolStock +
                dieselStock
            ) + " L";

    }


    // ==================================================
    // CUSTOMERS
    // ==================================================

    if (reportTotalCustomers) {

        reportTotalCustomers.textContent =
            formatNumber(
                customers.length
            );

    }


    let regularCustomers = 0;

    let vehicles = 0;


    customers.forEach(
        customer => {

            const visits =
                Number(

                    customer.visits ??
                    customer.totalVisits ??
                    customer.transactions ??
                    0

                ) || 0;


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


    if (reportRegularCustomers) {

        reportRegularCustomers.textContent =
            formatNumber(
                regularCustomers
            );

    }


    if (reportRegisteredVehicles) {

        reportRegisteredVehicles.textContent =
            formatNumber(
                vehicles
            );

    }


    // ==================================================
    // EXPENSE BREAKDOWN
    // ==================================================

    generateExpenseBreakdown(
        filteredExpenses,
        totalExpenses
    );


    // ==================================================
    // RECENT SALES
    // ==================================================

    displayRecentSales(
        filteredSales
    );


    // ==================================================
    // GENERATED TIME
    // ==================================================

    if (reportGeneratedText) {

        const currentTime =
            new Date()
                .toLocaleString();

        reportGeneratedText.textContent =
            `Report generated on ${currentTime}`;

    }

}


// ======================================================
// EXPENSE BREAKDOWN
// ======================================================

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


            if (
                !categories[category]
            ) {

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
            (a, b) =>
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


// ======================================================
// DISPLAY RECENT SALES
// ======================================================

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


    // --------------------------------------------------
    // Latest sales first
    // --------------------------------------------------

    const recentSales =
        sales
            .slice()
            .sort(
                (a, b) => {

                    const dateA =
                        parseDate(
                            getSaleDateValue(a)
                        );

                    const dateB =
                        parseDate(
                            getSaleDateValue(b)
                        );


                    if (
                        !dateA &&
                        !dateB
                    ) {

                        return 0;

                    }


                    if (!dateA) {

                        return 1;

                    }


                    if (!dateB) {

                        return -1;

                    }


                    return dateB - dateA;

                }
            )
            .slice(0, 10);


    recentSales.forEach(
        sale => {

            const fuel =
                String(
                    sale.fuel ??
                    sale.fuelType ??
                    sale.product ??
                    "-"
                );


            const fuelClass =
                fuel.toLowerCase()
                    .trim()
                    === "petrol"

                    ? "report-fuel-petrol"

                    : "report-fuel-diesel";


            const payment =
                sale.payment ||
                sale.paymentMethod ||
                "-";


            const customer =
                sale.customer ||
                sale.customerName ||
                "-";


            const invoice =
                sale.invoice ||
                sale.invoiceNumber ||
                sale.billNumber ||
                "-";


            const date =
                getSaleDateValue(sale) ||
                "-";


            reportSalesTableBody.innerHTML += `

                <tr>

                    <td>

                        <strong>
                            ${invoice}
                        </strong>

                    </td>

                    <td>

                        ${customer}

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

                        ${date}

                    </td>

                </tr>

            `;

        }
    );

}


// ======================================================
// REFRESH REPORT
// ======================================================

function refreshReportData() {

    updateReportDateText();

    generateReport();

}


// ======================================================
// PERIOD CHANGE
// ======================================================

if (reportPeriod) {

    reportPeriod.addEventListener(
        "change",
        () => {

            // Selecting a period clears exact date
            if (reportDate) {

                reportDate.value = "";

            }

            refreshReportData();

        }
    );

}


// ======================================================
// EXACT DATE CHANGE
// ======================================================

if (reportDate) {

    reportDate.addEventListener(
        "change",
        () => {

            refreshReportData();

        }
    );

}


// ======================================================
// CLEAR DATE
// ======================================================

if (clearReportDate) {

    clearReportDate.addEventListener(
        "click",
        () => {

            if (reportDate) {

                reportDate.value = "";

            }

            refreshReportData();

        }
    );

}


// ======================================================
// REFRESH BUTTON
// ======================================================

if (refreshReports) {

    refreshReports.addEventListener(
        "click",
        () => {

            refreshReportData();

        }
    );

}


// ======================================================
// PRINT REPORT
// ======================================================

if (printReport) {

    printReport.addEventListener(
        "click",
        () => {

            window.print();

        }
    );

}


// ======================================================
// AUTO REFRESH
// ======================================================

setInterval(
    () => {

        generateReport();

    },
    5000
);


// ======================================================
// INITIALIZE
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateReportDateText();

        generateReport();

    }
);