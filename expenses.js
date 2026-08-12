// ==========================================
// FuelFlow Expenses Module
// Complete JavaScript
// ==========================================


// ==========================================
// Select Elements
// ==========================================

const expenseForm =
    document.getElementById("expenseForm");

const expenseTitle =
    document.getElementById("expenseTitle");

const expenseCategory =
    document.getElementById("expenseCategory");

const expenseAmount =
    document.getElementById("expenseAmount");

const expenseDate =
    document.getElementById("expenseDate");

const expensePayment =
    document.getElementById("expensePayment");

const expenseDescription =
    document.getElementById("expenseDescription");

const expenseSearch =
    document.getElementById("expenseSearch");

const expenseTableBody =
    document.getElementById("expenseTableBody");

const totalExpensesElement =
    document.getElementById("totalExpenses");

const todayExpensesElement =
    document.getElementById("todayExpenses");

const monthlyExpensesElement =
    document.getElementById("monthlyExpenses");

const cancelExpense =
    document.getElementById("cancelExpense");

const openExpenseForm =
    document.getElementById("openExpenseForm");


// ==========================================
// Local Storage
// ==========================================

let expenses = [];

const savedExpenses =
    localStorage.getItem("expenses");


if(
    savedExpenses &&
    savedExpenses !== "undefined"
){

    try{

        expenses =
            JSON.parse(savedExpenses);

    }catch(error){

        console.error(
            "Error loading expenses:",
            error
        );

        expenses = [];

    }

}


// ==========================================
// Save Expenses
// ==========================================

function saveExpenses(){

    localStorage.setItem(
        "expenses",
        JSON.stringify(expenses)
    );

}


// ==========================================
// Generate Expense ID
// ==========================================

function generateExpenseId(){

    let lastId =
        Number(
            localStorage.getItem(
                "lastExpenseId"
            )
        ) || 1000;


    lastId++;


    localStorage.setItem(
        "lastExpenseId",
        lastId
    );


    return "EXP-" + lastId;

}


// ==========================================
// Get Today's Date
// ==========================================

function getTodayDate(){

    const today =
        new Date();

    const year =
        today.getFullYear();

    const month =
        String(
            today.getMonth() + 1
        ).padStart(2,"0");

    const day =
        String(
            today.getDate()
        ).padStart(2,"0");


    return `${year}-${month}-${day}`;

}


// ==========================================
// Set Default Date
// ==========================================

if(expenseDate){

    expenseDate.value =
        getTodayDate();

}


// ==========================================
// Format Currency
// ==========================================

function formatCurrency(amount){

    return "Rs. " +
        Number(amount || 0)
        .toLocaleString(
            "en-IN",
            {
                minimumFractionDigits:0,
                maximumFractionDigits:2
            }
        );

}


// ==========================================
// Add Expense
// ==========================================

if(expenseForm){

    expenseForm.addEventListener(
        "submit",
        function(e){

            e.preventDefault();


            // ==================================
            // Check Edit Mode
            // ==================================

            const editingId =
                expenseForm.dataset.editingId;


            // ==================================
            // Get Values
            // ==================================

            const title =
                expenseTitle.value.trim();

            const category =
                expenseCategory.value;

            const amount =
                Number(
                    expenseAmount.value
                );

            const date =
                expenseDate.value;

            const payment =
                expensePayment.value;

            const description =
                expenseDescription.value.trim();


            // ==================================
            // Validation
            // ==================================

            if(
                title === "" ||
                category === "" ||
                !amount ||
                amount <= 0 ||
                date === ""
            ){

                alert(
                    "Please fill all required fields correctly."
                );

                return;

            }


            // ==================================
            // UPDATE EXISTING EXPENSE
            // ==================================

            if(editingId){

                const index =
                    expenses.findIndex(
                        item =>
                            item.id === editingId
                    );


                if(index === -1){

                    alert(
                        "Expense not found."
                    );

                    return;

                }


                expenses[index] = {

                    ...expenses[index],

                    title:
                        title,

                    category:
                        category,

                    amount:
                        amount,

                    date:
                        date,

                    payment:
                        payment,

                    description:
                        description,

                    updatedAt:
                        new Date().toISOString()

                };


                saveExpenses();


                displayExpenses(
                    expenses
                );

                updateExpenseSummary();


                resetExpenseForm();


                alert(
                    "Expense updated successfully!"
                );


                return;

            }


            // ==================================
            // CREATE NEW EXPENSE
            // ==================================

            const expense = {

                id:
                    generateExpenseId(),

                title:
                    title,

                category:
                    category,

                amount:
                    amount,

                date:
                    date,

                payment:
                    payment,

                description:
                    description,

                createdAt:
                    new Date().toISOString()

            };


            // ==================================
            // Add to Array
            // ==================================

            expenses.push(
                expense
            );


            // ==================================
            // Save
            // ==================================

            saveExpenses();


            // ==================================
            // Refresh UI
            // ==================================

            displayExpenses(
                expenses
            );

            updateExpenseSummary();


            // ==================================
            // Reset
            // ==================================

            resetExpenseForm();


            alert(
                "Expense added successfully!"
            );

        }
    );

}


// ==========================================
// Display Expenses
// ==========================================

function displayExpenses(data){

    if(!expenseTableBody){

        return;

    }


    expenseTableBody.innerHTML = "";


    // ==================================
    // Empty State
    // ==================================

    if(data.length === 0){

        expenseTableBody.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    class="empty-expenses"
                >

                    No expenses found.

                </td>

            </tr>

        `;

        return;

    }


    // ==================================
    // Sort Newest First
    // ==================================

    const sortedData =
        [...data].sort(
            (a,b) => {

                const dateA =
                    new Date(
                        a.date
                    );

                const dateB =
                    new Date(
                        b.date
                    );


                return dateB - dateA;

            }
        );


    // ==================================
    // Create Rows
    // ==================================

    sortedData.forEach(
        expense => {

            const safeDescription =
                expense.description ||
                "—";


            expenseTableBody.innerHTML += `

                <tr>

                    <td class="expense-id">

                        ${expense.id}

                    </td>


                    <td>

                        ${formatDisplayDate(
                            expense.date
                        )}

                    </td>


                    <td>

                        ${expense.title}

                    </td>


                    <td>

                        <span
                            class="expense-category"
                        >

                            ${expense.category}

                        </span>

                    </td>


                    <td class="expense-amount">

                        ${formatCurrency(
                            expense.amount
                        )}

                    </td>


                    <td>

                        <span
                            class="expense-payment"
                        >

                            ${expense.payment}

                        </span>

                    </td>


                    <td
                        class="expense-description"
                        title="${safeDescription}"
                    >

                        ${safeDescription}

                    </td>


                    <td>

                        <div
                            class="expense-actions"
                        >

                            <button
                                class="edit-expense"
                                onclick="editExpense('${expense.id}')"
                                title="Edit Expense"
                            >

                                <i
                                    class="fa-solid fa-pen"
                                ></i>

                            </button>


                            <button
                                class="delete-expense"
                                onclick="deleteExpense('${expense.id}')"
                                title="Delete Expense"
                            >

                                <i
                                    class="fa-solid fa-trash"
                                ></i>

                            </button>

                        </div>

                    </td>

                </tr>

            `;

        }
    );

}


// ==========================================
// Format Display Date
// ==========================================

function formatDisplayDate(dateString){

    if(!dateString){

        return "—";

    }


    const parts =
        dateString.split("-");


    if(parts.length !== 3){

        return dateString;

    }


    return `${parts[2]}/${parts[1]}/${parts[0]}`;

}


// ==========================================
// Update Expense Summary
// ==========================================

function updateExpenseSummary(){

    let total =
        0;

    let todayTotal =
        0;

    let monthlyTotal =
        0;


    const today =
        getTodayDate();


    const currentDate =
        new Date();

    const currentYear =
        currentDate.getFullYear();

    const currentMonth =
        currentDate.getMonth() + 1;


    expenses.forEach(
        expense => {

            const amount =
                Number(
                    expense.amount || 0
                );


            total += amount;


            // ==================================
            // Today's Expenses
            // ==================================

            if(
                expense.date === today
            ){

                todayTotal += amount;

            }


            // ==================================
            // Monthly Expenses
            // ==================================

            const parts =
                expense.date.split("-");


            if(parts.length === 3){

                const year =
                    Number(parts[0]);

                const month =
                    Number(parts[1]);


                if(
                    year === currentYear &&
                    month === currentMonth
                ){

                    monthlyTotal += amount;

                }

            }

        }
    );


    // ==================================
    // Update Cards
    // ==================================

    if(totalExpensesElement){

        totalExpensesElement.textContent =
            formatCurrency(total);

    }


    if(todayExpensesElement){

        todayExpensesElement.textContent =
            formatCurrency(todayTotal);

    }


    if(monthlyExpensesElement){

        monthlyExpensesElement.textContent =
            formatCurrency(monthlyTotal);

    }

}


// ==========================================
// Search Expenses
// ==========================================

if(expenseSearch){

    expenseSearch.addEventListener(
        "input",
        function(){

            const keyword =
                expenseSearch.value
                .toLowerCase()
                .trim();


            if(keyword === ""){

                displayExpenses(
                    expenses
                );

                return;

            }


            const filtered =
                expenses.filter(
                    expense => {

                        return(

                            expense.id
                                .toLowerCase()
                                .includes(
                                    keyword
                                )

                            ||

                            expense.title
                                .toLowerCase()
                                .includes(
                                    keyword
                                )

                            ||

                            expense.category
                                .toLowerCase()
                                .includes(
                                    keyword
                                )

                            ||

                            expense.payment
                                .toLowerCase()
                                .includes(
                                    keyword
                                )

                            ||

                            (
                                expense.description ||
                                ""
                            )
                            .toLowerCase()
                            .includes(
                                keyword
                            )

                            ||

                            expense.date
                                .includes(
                                    keyword
                                )

                        );

                    }
                );


            displayExpenses(
                filtered
            );

        }
    );

}


// ==========================================
// Edit Expense
// ==========================================

function editExpense(id){

    const expense =
        expenses.find(
            item =>
                item.id === id
        );


    if(!expense){

        alert(
            "Expense not found."
        );

        return;

    }


    // ==================================
    // Fill Form
    // ==================================

    expenseTitle.value =
        expense.title;

    expenseCategory.value =
        expense.category;

    expenseAmount.value =
        expense.amount;

    expenseDate.value =
        expense.date;

    expensePayment.value =
        expense.payment;

    expenseDescription.value =
        expense.description || "";


    // ==================================
    // Enable Edit Mode
    // ==================================

    expenseForm.dataset.editingId =
        expense.id;


    // ==================================
    // Change Button
    // ==================================

    const saveButton =
        expenseForm.querySelector(
            ".expense-save-btn"
        );


    if(saveButton){

        saveButton.innerHTML = `

            <i class="fa-solid fa-pen"></i>

            Update Expense

        `;

    }


    // ==================================
    // Scroll to Form
    // ==================================

    const formCard =
        document.getElementById(
            "expenseFormCard"
        );


    if(formCard){

        formCard.scrollIntoView({

            behavior:"smooth",

            block:"start"

        });

    }


    setTimeout(
        () => expenseTitle.focus(),
        400
    );

}


// ==========================================
// Delete Expense
// ==========================================

function deleteExpense(id){

    const expense =
        expenses.find(
            item =>
                item.id === id
        );


    if(!expense){

        alert(
            "Expense not found."
        );

        return;

    }


    const confirmed =
        confirm(
            `Are you sure you want to delete "${expense.title}"?`
        );


    if(!confirmed){

        return;

    }


    expenses =
        expenses.filter(
            item =>
                item.id !== id
        );


    saveExpenses();


    displayExpenses(
        expenses
    );

    updateExpenseSummary();


    alert(
        "Expense deleted successfully."
    );

}


// ==========================================
// Reset Expense Form
// ==========================================

function resetExpenseForm(){

    if(!expenseForm){

        return;

    }


    expenseForm.reset();


    delete expenseForm.dataset.editingId;


    // ==================================
    // Restore Default Values
    // ==================================

    if(expenseDate){

        expenseDate.value =
            getTodayDate();

    }


    if(expensePayment){

        expensePayment.value =
            "Cash";

    }


    // ==================================
    // Restore Save Button
    // ==================================

    const saveButton =
        expenseForm.querySelector(
            ".expense-save-btn"
        );


    if(saveButton){

        saveButton.innerHTML = `

            <i class="fa-solid fa-plus"></i>

            Save Expense

        `;

    }

}


// ==========================================
// Cancel Expense
// ==========================================

if(cancelExpense){

    cancelExpense.addEventListener(
        "click",
        function(){

            resetExpenseForm();

        }
    );

}


// ==========================================
// Open Expense Form
// ==========================================

if(openExpenseForm){

    openExpenseForm.addEventListener(
        "click",
        function(){

            const formCard =
                document.getElementById(
                    "expenseFormCard"
                );


            if(formCard){

                formCard.scrollIntoView({

                    behavior:"smooth",

                    block:"start"

                });

            }


            setTimeout(
                () => {

                    if(expenseTitle){

                        expenseTitle.focus();

                    }

                },
                400
            );

        }
    );

}


// ==========================================
// Listen for Storage Changes
// ==========================================
// Useful if another module changes
// expense data in localStorage.
// ==========================================

window.addEventListener(
    "storage",
    function(e){

        if(e.key !== "expenses"){

            return;

        }


        try{

            expenses =
                JSON.parse(
                    e.newValue
                ) || [];

        }catch(error){

            expenses = [];

        }


        displayExpenses(
            expenses
        );

        updateExpenseSummary();

    }
);


// ==========================================
// Initialize Expenses
// ==========================================

function initializeExpenses(){

    // Set today's date

    if(expenseDate){

        expenseDate.value =
            getTodayDate();

    }


    // Default payment method

    if(expensePayment){

        expensePayment.value =
            "Cash";

    }


    // Display existing data

    displayExpenses(
        expenses
    );


    // Calculate totals

    updateExpenseSummary();

}


// ==========================================
// Start Module
// ==========================================

initializeExpenses();