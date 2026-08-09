// ==========================================
// FuelFlow Employees Module
// Part 1/4
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


const employeeForm =
document.getElementById("employeeForm");


const employeeName =
document.getElementById("employeeName");


const employeePhone =
document.getElementById("employeePhone");


const employeePosition =
document.getElementById("employeePosition");


const employeeSalary =
document.getElementById("employeeSalary");


const joiningDate =
document.getElementById("joiningDate");


const employeeStatus =
document.getElementById("employeeStatus");


const employeeTableBody =
document.getElementById("employeeTableBody");


const employeeSearch =
document.getElementById("employeeSearch");


const cancelEmployee =
document.getElementById("cancelEmployee");


const openEmployeeForm =
document.getElementById("openEmployeeForm");


// Summary elements

const totalEmployees =
document.getElementById("totalEmployees");


const activeEmployees =
document.getElementById("activeEmployees");


const leaveEmployees =
document.getElementById("leaveEmployees");



// ==============================
// Local Storage Database
// ==============================


let employees = [];



const savedEmployees =
localStorage.getItem("employees");



if(
    savedEmployees &&
    savedEmployees !== "undefined"
){

    try{

        employees =
        JSON.parse(savedEmployees);

    }

    catch(error){

        console.error(
            "Unable to load employees:",
            error
        );

        employees = [];

    }

}



// ==============================
// Save Employees
// ==============================


function saveEmployees(){

    localStorage.setItem(

        "employees",

        JSON.stringify(employees)

    );

}



// ==============================
// Generate Employee ID
// ==============================


function generateEmployeeId(){

    let lastId =
    localStorage.getItem("lastEmployeeId");


    if(!lastId){

        lastId = 1000;

    }


    const newId =
    Number(lastId) + 1;


    localStorage.setItem(

        "lastEmployeeId",

        newId

    );


    return "EMP-" + newId;

}
// ==========================================
// Part 2/4
// Add Employee
// ==========================================


// ==============================
// Add Employee
// ==============================

if(employeeForm){

    employeeForm.addEventListener(
        "submit",
        function(e){

            e.preventDefault();


            // ==============================
            // Get Form Values
            // ==============================

            const name =
            employeeName.value.trim();


            const phone =
            employeePhone.value.trim();


            const position =
            employeePosition.value;


            const salary =
            Number(employeeSalary.value);


            const joining =
            joiningDate.value;


            const status =
            employeeStatus.value;



            // ==============================
            // Validation
            // ==============================

            if(

                name === "" ||

                phone === "" ||

                position === "" ||

                joining === "" ||

                salary <= 0

            ){

                alert(
                    "Please fill all employee details correctly."
                );

                return;

            }



            // ==============================
            // Create Employee Object
            // ==============================

            const employee = {

                id:
                generateEmployeeId(),

                name:
                name,

                phone:
                phone,

                position:
                position,

                salary:
                salary,

                joiningDate:
                joining,

                status:
                status,

                createdAt:
                new Date().toISOString()

            };



            // ==============================
            // Add To Employees Array
            // ==============================

            employees.push(employee);



            // ==============================
            // Save To Local Storage
            // ==============================

            saveEmployees();



            // ==============================
            // Refresh Employee Page
            // ==============================

            displayEmployees(employees);

            updateEmployeeSummary();



            // ==============================
            // Clear Form
            // ==============================

            employeeForm.reset();



            // ==============================
            // Success Message
            // ==============================

            alert(
                "Employee added successfully!"
            );

        }

    );

}



// ==============================
// Cancel Employee Form
// ==============================

if(cancelEmployee){

    cancelEmployee.addEventListener(
        "click",
        function(){

            if(employeeForm){

                employeeForm.reset();

            }

        }
    );

}



// ==============================
// Open Employee Form
// ==============================

if(openEmployeeForm){

    openEmployeeForm.addEventListener(
        "click",
        function(){

            if(employeeName){

                employeeName.focus();

            }

        }
    );

}
// ==========================================
// Part 3/4
// Display Employees + Summary
// ==========================================


// ==============================
// Update Employee Summary
// ==============================

function updateEmployeeSummary(){

    const total =
    employees.length;


    const active =
    employees.filter(
        employee => employee.status === "Active"
    ).length;


    const onLeave =
    employees.filter(
        employee => employee.status === "On Leave"
    ).length;



    if(totalEmployees){

        totalEmployees.textContent =
        total;

    }


    if(activeEmployees){

        activeEmployees.textContent =
        active;

    }


    if(leaveEmployees){

        leaveEmployees.textContent =
        onLeave;

    }

}



// ==============================
// Display Employees
// ==============================

function displayEmployees(data){

    if(!employeeTableBody){

        return;

    }


    employeeTableBody.innerHTML = "";



    // ==============================
    // Empty State
    // ==============================

    if(data.length === 0){

        employeeTableBody.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    class="empty-employees"
                >

                    No employees found.

                </td>

            </tr>

        `;

        return;

    }



    // ==============================
    // Display Employee Rows
    // ==============================

    data.forEach((employee)=>{


        let statusClass = "inactive";


        if(employee.status === "Active"){

            statusClass = "active";

        }

        else if(employee.status === "On Leave"){

            statusClass = "leave";

        }



        employeeTableBody.innerHTML += `

            <tr>


                <!-- Employee ID -->

                <td class="employee-id">

                    ${employee.id}

                </td>



                <!-- Name -->

                <td>

                    ${employee.name}

                </td>



                <!-- Phone -->

                <td>

                    ${employee.phone}

                </td>



                <!-- Position -->

                <td>

                    ${employee.position}

                </td>



                <!-- Salary -->

                <td>

                    Rs.
                    ${Number(
                        employee.salary
                    ).toLocaleString()}

                </td>



                <!-- Joining Date -->

                <td>

                    ${employee.joiningDate}

                </td>



                <!-- Status -->

                <td>

                    <span
                        class="employee-status ${statusClass}"
                    >

                        ${employee.status}

                    </span>

                </td>



                <!-- Actions -->

                <td>

                    <div class="employee-actions">


                        <button
                            class="edit-employee"
                            onclick="editEmployee('${employee.id}')"
                            title="Edit Employee"
                        >

                            <i class="fa-solid fa-pen"></i>

                        </button>



                        <button
                            class="delete-employee"
                            onclick="deleteEmployee('${employee.id}')"
                            title="Delete Employee"
                        >

                            <i class="fa-solid fa-trash"></i>

                        </button>


                    </div>

                </td>


            </tr>

        `;

    });

}



// ==============================
// Search Employees
// ==============================

if(employeeSearch){

    employeeSearch.addEventListener(
        "input",
        function(){

            const keyword =
            employeeSearch.value
            .toLowerCase()
            .trim();



            const filteredEmployees =
            employees.filter(
                (employee)=>{

                    return(

                        employee.id
                        .toLowerCase()
                        .includes(keyword)

                        ||

                        employee.name
                        .toLowerCase()
                        .includes(keyword)

                        ||

                        employee.phone
                        .toLowerCase()
                        .includes(keyword)

                        ||

                        employee.position
                        .toLowerCase()
                        .includes(keyword)

                    );

                }
            );



            displayEmployees(
                filteredEmployees
            );

        }
    );

}
// ==========================================
// Part 4/4
// Edit + Delete + Initialization
// ==========================================



// ==============================
// Delete Employee
// ==============================

function deleteEmployee(id){

    const employee =
    employees.find(
        employee => employee.id === id
    );


    if(!employee){

        alert("Employee not found.");

        return;

    }



    const confirmDelete =
    confirm(
        `Are you sure you want to delete ${employee.name}?`
    );


    if(!confirmDelete){

        return;

    }



    employees =
    employees.filter(
        employee => employee.id !== id
    );



    saveEmployees();


    displayEmployees(employees);

    updateEmployeeSummary();


    alert("Employee deleted successfully.");

}



// ==============================
// Edit Employee
// ==============================

function editEmployee(id){

    const employee =
    employees.find(
        employee => employee.id === id
    );


    if(!employee){

        alert("Employee not found.");

        return;

    }



    // Fill form with existing data

    employeeName.value =
    employee.name;


    employeePhone.value =
    employee.phone;


    employeePosition.value =
    employee.position;


    employeeSalary.value =
    employee.salary;


    joiningDate.value =
    employee.joiningDate;


    employeeStatus.value =
    employee.status;



    // Remove old employee

    employees =
    employees.filter(
        item => item.id !== id
    );


    saveEmployees();


    displayEmployees(employees);

    updateEmployeeSummary();



    // Change button text

    const saveButton =
    employeeForm.querySelector(
        ".employee-save-btn"
    );


    if(saveButton){

        saveButton.innerHTML = `

            <i class="fa-solid fa-user-pen"></i>

            Update Employee

        `;

    }



    // Store editing ID

    employeeForm.dataset.editingId =
    id;



    // Scroll to form

    employeeForm.scrollIntoView({

        behavior:"smooth",

        block:"start"

    });

}



// ==============================
// Handle Edit Form Submission
// ==============================

employeeForm.addEventListener(
    "submit",
    function(e){

        e.preventDefault();



        const editingId =
        employeeForm.dataset.editingId;



        // If editing an employee

        if(editingId){

            const updatedEmployee = {

                id:editingId,

                name:
                employeeName.value.trim(),

                phone:
                employeePhone.value.trim(),

                position:
                employeePosition.value,

                salary:
                Number(
                    employeeSalary.value
                ),

                joiningDate:
                joiningDate.value,

                status:
                employeeStatus.value,

                updatedAt:
                new Date().toISOString()

            };



            // Validation

            if(

                updatedEmployee.name === "" ||

                updatedEmployee.phone === "" ||

                updatedEmployee.position === "" ||

                updatedEmployee.joiningDate === "" ||

                updatedEmployee.salary <= 0

            ){

                alert(
                    "Please fill all employee details correctly."
                );

                return;

            }



            employees.push(
                updatedEmployee
            );


            saveEmployees();


            displayEmployees(
                employees
            );


            updateEmployeeSummary();



            // Clear editing mode

            delete employeeForm.dataset.editingId;



            // Restore button

            const saveButton =
            employeeForm.querySelector(
                ".employee-save-btn"
            );


            if(saveButton){

                saveButton.innerHTML = `

                    <i class="fa-solid fa-user-plus"></i>

                    Save Employee

                `;

            }



            employeeForm.reset();


            alert(
                "Employee updated successfully!"
            );

        }

    }
);



// ==============================
// Cancel Edit
// ==============================

if(cancelEmployee){

    cancelEmployee.addEventListener(
        "click",
        function(){

            delete employeeForm.dataset.editingId;


            employeeForm.reset();



            const saveButton =
            employeeForm.querySelector(
                ".employee-save-btn"
            );


            if(saveButton){

                saveButton.innerHTML = `

                    <i class="fa-solid fa-user-plus"></i>

                    Save Employee

                `;

            }

        }
    );

}



// ==============================
// Initial Page Load
// ==============================

function initializeEmployees(){

    const savedEmployees =
    localStorage.getItem("employees");


    if(
        savedEmployees &&
        savedEmployees !== "undefined"
    ){

        try{

            employees =
            JSON.parse(savedEmployees);

        }

        catch(error){

            console.error(
                "Error loading employees:",
                error
            );

            employees = [];

        }

    }

    else{

        employees = [];

    }



    displayEmployees(
        employees
    );


    updateEmployeeSummary();

}



// ==============================
// Start Employees Module
// ==============================

initializeEmployees();