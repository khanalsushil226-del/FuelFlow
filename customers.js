
const customerForm =
    document.getElementById("customerForm");

const customerName =
    document.getElementById("customerName");

const customerPhone =
    document.getElementById("customerPhone");

const customerVehicle =
    document.getElementById("customerVehicle");

const vehicleType =
    document.getElementById("vehicleType");

const customerAddress =
    document.getElementById("customerAddress");

const customerType =
    document.getElementById("customerType");

const customerSearch =
    document.getElementById("customerSearch");

const customerTableBody =
    document.getElementById("customerTableBody");

const totalCustomers =
    document.getElementById("totalCustomers");

const regularCustomers =
    document.getElementById("regularCustomers");

const totalCustomerFuel = document.getElementById("totalCustomerFuel");

const cancelCustomer =document.getElementById("cancelCustomer");

const openCustomerForm =
    document.getElementById("openCustomerForm");


let customers = [];

const savedCustomers =localStorage.getItem("customers");

if(savedCustomers && savedCustomers !== "undefined"){

    try{

        customers = JSON.parse(savedCustomers);

    }catch(error){

        console.error(
            "Error loading customers:", error);

        customers = [];

    }

}


function saveCustomers(){

    localStorage.setItem(
        "customers",
        JSON.stringify(customers)
    );

}

function generateCustomerId(){

    let lastId =
        Number(
            localStorage.getItem(
                "lastCustomerId"
            )
        ) || 1000;


    lastId++;


    localStorage.setItem(
        "lastCustomerId",
        lastId
    );


    return "CUS-" + lastId;

}

if(customerForm){

    customerForm.addEventListener(
        "submit",
        function(e){

            e.preventDefault();


            const name =
                customerName.value.trim();

            const phone =
                customerPhone.value.trim();

            const vehicle =
                customerVehicle.value
                .trim()
                .toUpperCase();

            const type =
                vehicleType.value;

            const address =
                customerAddress.value.trim();

            const customerCategory =
                customerType.value;


           
            if(
                name === "" ||
                phone === "" ||
                vehicle === "" ||
                type === ""
            ){

                alert(
                    "Please fill all required fields."
                );

                return;

            }
            const duplicate =
                customers.find(
                    customer =>
                        customer.vehicle === vehicle
                );


            if(duplicate){

                alert(
                    "This vehicle is already registered."
                );

                return;

            }


            const customer = {

                id:
                    generateCustomerId(),

                name:
                    name,

                phone:
                    phone,

                vehicle:
                    vehicle,

                vehicleType:
                    type,

                address:
                    address,

                customerType:
                    customerCategory,

                fuelPurchased:
                    0,

                totalSpent:
                    0,

                createdAt:
                    new Date().toISOString()

            };


            customers.push(customer);

            saveCustomers();

            displayCustomers(
                customers
            );

            updateCustomerSummary();


            customerForm.reset();


            alert(
                "Customer added successfully!"
            );

        }
    );

}


function displayCustomers(data){

    if(!customerTableBody){

        return;

    }


    customerTableBody.innerHTML = "";



    if(data.length === 0){

        customerTableBody.innerHTML = `

            <tr>

                <td
                    colspan="9"
                    class="empty-customers"
                >

                    No customers found.

                </td>

            </tr>

        `;

        return;

    }


    
    data.forEach(customer => {

        let typeClass =
            customer.customerType
                .toLowerCase()
                .replace(/\s+/g, "-");


        customerTableBody.innerHTML += `

            <tr>

                <td class="customer-id">

                    ${customer.id}

                </td>


                <td>

                    ${customer.name}

                </td>


                <td>

                    ${customer.phone}

                </td>


                <td>

                    ${customer.vehicle}

                </td>


                <td>

                    ${customer.vehicleType}

                </td>


                <td>

                    <span
                        class="customer-type ${typeClass}"
                    >

                        ${customer.customerType}

                    </span>

                </td>


                <td>

                    ${Number(
                        customer.fuelPurchased || 0
                    ).toFixed(2)} L

                </td>


                <td>

                    Rs.
                    ${Number(
                        customer.totalSpent || 0
                    ).toLocaleString()}

                </td>


                <td>

                    <div class="customer-actions">

                        <button
                            class="edit-customer"
                            onclick="editCustomer('${customer.id}')"
                            title="Edit Customer"
                        >

                            <i class="fa-solid fa-pen"></i>

                        </button>


                        <button
                            class="delete-customer"
                            onclick="deleteCustomer('${customer.id}')"
                            title="Delete Customer"
                        >

                            <i class="fa-solid fa-trash"></i>

                        </button>

                    </div>

                </td>

            </tr>

        `;

    });

}


function updateCustomerSummary(){

    const total =
        customers.length;


    const regular =
        customers.filter(
            customer =>
                customer.customerType === "Regular"
        ).length;


    const fuel =
        customers.reduce(
            (sum, customer) =>
                sum +
                Number(
                    customer.fuelPurchased || 0
                ),
            0
        );


    if(totalCustomers){

        totalCustomers.textContent =
            total;

    }


    if(regularCustomers){

        regularCustomers.textContent =
            regular;

    }


    if(totalCustomerFuel){

        totalCustomerFuel.textContent =
            fuel.toFixed(2) + " L";

    }

}


if(customerSearch){

    customerSearch.addEventListener(
        "input",
        function(){

            const keyword =
                customerSearch.value
                .toLowerCase()
                .trim();


            const filtered =
                customers.filter(
                    customer => {

                        return(

                            customer.id
                                .toLowerCase()
                                .includes(keyword)

                            ||

                            customer.name
                                .toLowerCase()
                                .includes(keyword)

                            ||

                            customer.phone
                                .toLowerCase()
                                .includes(keyword)

                            ||

                            customer.vehicle
                                .toLowerCase()
                                .includes(keyword)

                            ||

                            customer.vehicleType
                                .toLowerCase()
                                .includes(keyword)

                        );

                    }
                );


            displayCustomers(
                filtered
            );

        }
    );

}


function deleteCustomer(id){

    const customer =
        customers.find(
            item => item.id === id
        );


    if(!customer){

        alert(
            "Customer not found."
        );

        return;

    }


    const confirmed =
        confirm(
            `Are you sure you want to delete ${customer.name}?`
        );


    if(!confirmed){

        return;

    }


    customers =
        customers.filter(
            item => item.id !== id
        );


    saveCustomers();


    displayCustomers(
        customers
    );

    updateCustomerSummary();


    alert(
        "Customer deleted successfully."
    );

}


function editCustomer(id){

    const customer =
        customers.find(
            item => item.id === id
        );


    if(!customer){

        alert(
            "Customer not found."
        );

        return;

    }


    customerName.value =
        customer.name;

    customerPhone.value =
        customer.phone;

    customerVehicle.value =
        customer.vehicle;

    vehicleType.value =
        customer.vehicleType;

    customerAddress.value =
        customer.address || "";

    customerType.value =
        customer.customerType;


    customerForm.dataset.editingId =
        id;


    const saveButton =
        customerForm.querySelector(
            ".customer-save-btn"
        );


    if(saveButton){

        saveButton.innerHTML = `

            <i class="fa-solid fa-user-pen"></i>

            Update Customer

        `;

    }


    customerForm.scrollIntoView({

        behavior: "smooth",

        block: "start"

    });

}

if(customerForm){

    customerForm.addEventListener(
        "submit",
        function(e){

            const editingId =
                customerForm.dataset.editingId;


            if(!editingId){

                return;

            }


            e.preventDefault();

            e.stopImmediatePropagation();


            const index =
                customers.findIndex(
                    customer =>
                        customer.id === editingId
                );


            if(index === -1){

                alert(
                    "Customer not found."
                );

                return;

            }


            const name =
                customerName.value.trim();

            const phone =
                customerPhone.value.trim();

            const vehicle =
                customerVehicle.value
                .trim()
                .toUpperCase();

            const type =
                vehicleType.value;

            const address =
                customerAddress.value.trim();

            const category =
                customerType.value;


            if(
                name === "" ||
                phone === "" ||
                vehicle === "" ||
                type === ""
            ){

                alert(
                    "Please fill all required fields."
                );

                return;

            }


            const duplicate =
                customers.find(
                    customer =>
                        customer.vehicle === vehicle &&
                        customer.id !== editingId
                );


            if(duplicate){

                alert(
                    "Another customer already uses this vehicle number."
                );

                return;

            }


            customers[index] = {

                ...customers[index],

                name:
                    name,

                phone:
                    phone,

                vehicle:
                    vehicle,

                vehicleType:
                    type,

                address:
                    address,

                customerType:
                    category,

                updatedAt:
                    new Date().toISOString()

            };


            saveCustomers();


            displayCustomers(
                customers
            );

            updateCustomerSummary();


            customerForm.reset();


            delete customerForm.dataset.editingId;


            const saveButton =
                customerForm.querySelector(
                    ".customer-save-btn"
                );


            if(saveButton){

                saveButton.innerHTML = `

                    <i class="fa-solid fa-user-plus"></i>

                    Save Customer

                `;

            }


            alert(
                "Customer updated successfully!"
            );

        },
        true
    );

}

if(cancelCustomer){

    cancelCustomer.addEventListener(
        "click",
        function(){

            customerForm.reset();


            delete customerForm.dataset.editingId;


            const saveButton =
                customerForm.querySelector(
                    ".customer-save-btn"
                );


            if(saveButton){

                saveButton.innerHTML = `

                    <i class="fa-solid fa-user-plus"></i>

                    Save Customer

                `;

            }

        }
    );

}

if(openCustomerForm){

    openCustomerForm.addEventListener(
        "click",
        function(){

            customerForm.scrollIntoView({

                behavior: "smooth",

                block: "start"

            });


            setTimeout(
                () => customerName.focus(),
                400
            );

        }
    );

}


function initializeCustomers(){

    displayCustomers(
        customers
    );

    updateCustomerSummary();

}



initializeCustomers();