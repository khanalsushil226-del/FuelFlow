// ======================================================
// FuelFlow Reports Module
// FROM DATE → TO DATE REPORT FILTER
// ======================================================


// ======================================================
// DOM ELEMENTS
// ======================================================

// Report controls

const fromDate =
    document.getElementById("fromDate");

const toDate =
    document.getElementById("toDate");

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

function getStorageData(
    key,
    defaultValue = []
) {

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
        getStorageData(
            "sales",
            []
        );


    return Array.isArray(sales)
        ? sales
        : [];

}


// ======================================================
// LOAD EXPENSES
// ======================================================

function getExpensesData() {

    const expenses =
        getStorageData(
            "expenses",
            []
        );


    return Array.isArray(expenses)
        ? expenses
        : [];

}


// ======================================================
// LOAD CUSTOMERS
// ======================================================

function getCustomersData() {

    const customers =
        getStorageData(
            "customers",
            []
        );


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


    return value.toLocaleString(
        "en-IN"
    );

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
        !isNaN(
            date.getTime()
        )
    ) {

        return date;

    }


    return null;

}


// ======================================================
// INPUT DATE PARSER
// ======================================================
// Converts YYYY-MM-DD into a LOCAL date.
// This avoids timezone problems with <input type="date">.
// ======================================================

function parseInputDate(value) {

    if (!value) {

        return null;

    }


    const parts =
        value.split("-");


    if (
        parts.length !== 3
    ) {

        return null;

    }


    const year =
        Number(parts[0]);

    const month =
        Number(parts[1]) - 1;

    const day =
        Number(parts[2]);


    const date =
        new Date(
            year,
            month,
            day
        );


    date.setHours(
        0,
        0,
        0,
        0
    );


    return date;

}


// ======================================================
// START OF DAY
// ======================================================

function startOfDay(date) {

    const result =
        new Date(date);


    result.setHours(
        0,
        0,
        0,
        0
    );


    return result;

}


// ======================================================
// END OF DAY
// ======================================================

function endOfDay(date) {

    const result =
        new Date(date);


    result.setHours(
        23,
        59,
        59,
        999
    );


    return result;

}


// ======================================================
// GET SALE DATE
// ======================================================

function getSaleDateValue(sale) {

    return (
        sale.date ||
        sale.createdAt ||
        sale.saleDate ||
        sale.transactionDate ||
        sale.timestamp ||
        null
    );

}


// ======================================================
// GET EXPENSE DATE
// ======================================================

function getExpenseDateValue(expense) {

    return (
        expense.date ||
        expense.createdAt ||
        expense.expenseDate ||
        expense.transactionDate ||
        expense.timestamp ||
        null
    );

}


// ======================================================
// CHECK DATE RANGE
// ======================================================

function isDateInRange(
    itemDate,
    from,
    to
) {

    const date =
        parseDate(itemDate);


    if (!date) {

        return false;

    }


    const dateOnly =
        startOfDay(date);


    // ----------------------------------------------
    // FROM DATE
    // ----------------------------------------------

    if (
        from &&
        dateOnly < from
    ) {

        return false;

    }


    // ----------------------------------------------
    // TO DATE
    // ----------------------------------------------

    if (
        to &&
        dateOnly > to
    ) {

        return false;

    }


    return true;

}


// ======================================================
// GET SELECTED DATE RANGE
// ======================================================

function getSelectedDateRange() {

    const from =
        fromDate &&
        fromDate.value
            ? parseInputDate(
                fromDate.value
            )
            : null;


    const to =
        toDate &&
        toDate.value
            ? parseInputDate(
                toDate.value
            )
            : null;


    return {
        from,
        to
    };

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
// GENERATE REPORT
// ======================================================

function generateReport() {

    // ----------------------------------------------
    // GET DATE RANGE
    // ----------------------------------------------

    const range =
        getSelectedDateRange();


    const from =
        range.from;

    const to =
        range.to;


    // ----------------------------------------------
    // LOAD DATA
    // ----------------------------------------------

    const allSales =
        getSalesData();

    const allExpenses =
        getExpensesData();

    const customers =
        getCustomersData();

    const fuelStock =
        getFuelStockData();


    // ==================================================
    // FILTER SALES
    // ==================================================

    const filteredSales =
        allSales.filter(
            sale => {

                return isDateInRange(
                    getSaleDateValue(sale),
                    from,
                    to
                );

            }
        );


    // ==================================================
    // FILTER EXPENSES
    // ==================================================

    const filteredExpenses =
        allExpenses.filter(
            expense => {

                return isDateInRange(
                    getExpenseDateValue(expense),
                    from,
                    to
                );

            }
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


            totalSales +=
                amount;


            totalFuel +=
                litres;


            if (
                fuel === "petrol"
            ) {

                petrolLitres +=
                    litres;

                petrolSales +=
                    amount;

            }


            else if (
                fuel === "diesel"
            ) {

                dieselLitres +=
                    litres;

                dieselSales +=
                    amount;

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
    // NET PROFIT
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
    // SUMMARY CARDS
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


    if (
        totalFuelSales > 0
    ) {

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


    const averageTransactionValue =
        transactions > 0
            ? totalSales / transactions
            : 0;


    if (averageTransaction) {

        averageTransaction.textContent =
            formatCurrency(
                averageTransactionValue
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
    // CURRENT INVENTORY
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
    // CUSTOMER INFORMATION
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


            if (
                visits > 1
            ) {

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
    // UPDATE REPORT FOOTER
    // ==================================================

    if (reportGeneratedText) {

        const now =
            new Date();


        reportGeneratedText.textContent =
            `Report generated on ${now.toLocaleString()}`;

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

                categories[category] =
                    0;

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


                    <span
                        class="expense-breakdown-amount"
                    >

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


    // ----------------------------------------------
    // Sort newest first
    // ----------------------------------------------

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
            .slice(
                0,
                10
            );


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
                fuel
                    .toLowerCase()
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


            const saleDate =
                getSaleDateValue(
                    sale
                );


            let formattedDate = "-";


            if (saleDate) {

                const date =
                    parseDate(
                        saleDate
                    );


                if (date) {

                    formattedDate =
                        date.toLocaleString(
                            "en-NP",
                            {
                                dateStyle:
                                    "short",
                                timeStyle:
                                    "short"
                            }
                        );

                }

            }


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

                        ${formattedDate}

                    </td>

                </tr>

            `;

        }
    );

}


// ======================================================
// VALIDATE DATE RANGE
// ======================================================

function validateDateRange() {

    const from =
        fromDate &&
        fromDate.value
            ? parseInputDate(
                fromDate.value
            )
            : null;


    const to =
        toDate &&
        toDate.value
            ? parseInputDate(
                toDate.value
            )
            : null;


    // ----------------------------------------------
    // Nothing selected
    // ----------------------------------------------

    if (
        !from &&
        !to
    ) {

        return true;

    }


    // ----------------------------------------------
    // Only FROM selected
    // ----------------------------------------------

    if (
        from &&
        !to
    ) {

        alert(
            "Please select a To Date."
        );

        return false;

    }


    // ----------------------------------------------
    // Only TO selected
    // ----------------------------------------------

    if (
        !from &&
        to
    ) {

        alert(
            "Please select a From Date."
        );

        return false;

    }


    // ----------------------------------------------
    // FROM > TO
    // ----------------------------------------------

    if (
        from > to
    ) {

        alert(
            "From Date cannot be later than To Date."
        );

        return false;

    }


    return true;

}


// ======================================================
// REFRESH REPORT
// ======================================================

function refreshReportData() {

    // ----------------------------------------------
    // Validate first
    // ----------------------------------------------

    if (
        !validateDateRange()
    ) {

        return;

    }


    // ----------------------------------------------
    // Generate report
    // ----------------------------------------------

    generateReport();

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
// INITIALIZE
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        generateReport();

    }
);