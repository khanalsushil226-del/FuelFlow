// ==========================================
// FuelFlow Settings Module
// ==========================================


// ==========================================
// Load Settings From LocalStorage
// ==========================================

let fuelFlowSettings = JSON.parse(
    localStorage.getItem("fuelFlowSettings")
) || {

    profile: {
        name: "Admin",
        email: "",
        phone: "",
        role: "Administrator"
    },

    pump: {
        name: "",
        location: "",
        phone: "",
        email: "",
        address: ""
    },

    fuelPrices: {
        petrol: 180,
        diesel: 165
    },

    preferences: {
        currency: "NPR",
        lowStockWarning: true,
        notifications: true,
        autoRefresh: true
    }

};


// ==========================================
// Save Settings
// ==========================================

function saveSettings(){

    localStorage.setItem(
        "fuelFlowSettings",
        JSON.stringify(fuelFlowSettings)
    );

}



// ==========================================
// Get Elements
// ==========================================


// Profile

const adminName =
    document.getElementById("adminName");

const adminEmail =
    document.getElementById("adminEmail");

const adminPhone =
    document.getElementById("adminPhone");

const adminRole =
    document.getElementById("adminRole");


// Pump

const pumpName =
    document.getElementById("pumpName");

const pumpLocation =
    document.getElementById("pumpLocation");

const pumpPhone =
    document.getElementById("pumpPhone");

const pumpEmail =
    document.getElementById("pumpEmail");

const pumpAddress =
    document.getElementById("pumpAddress");


// Fuel Prices

const petrolPrice =
    document.getElementById("petrolPrice");

const dieselPrice =
    document.getElementById("dieselPrice");


// Preferences

const currency =
    document.getElementById("currency");

const lowStockWarning =
    document.getElementById("lowStockWarning");

const notifications =
    document.getElementById("notifications");

const autoRefresh =
    document.getElementById("autoRefresh");


// Header

const headerUserName =
    document.getElementById("headerUserName");


// Buttons

const saveProfileBtn =
    document.getElementById("saveProfileBtn");

const savePumpBtn =
    document.getElementById("savePumpBtn");

const saveFuelPriceBtn =
    document.getElementById("saveFuelPriceBtn");

const savePreferencesBtn =
    document.getElementById("savePreferencesBtn");

const changePasswordBtn =
    document.getElementById("changePasswordBtn");

const clearDataBtn =
    document.getElementById("clearDataBtn");

const logoutBtn =
    document.getElementById("logoutBtn");



// ==========================================
// Load Settings Into Form
// ==========================================

function loadSettings(){

    // ==============================
    // Profile
    // ==============================

    if(adminName){

        adminName.value =
            fuelFlowSettings.profile.name || "";

    }


    if(adminEmail){

        adminEmail.value =
            fuelFlowSettings.profile.email || "";

    }


    if(adminPhone){

        adminPhone.value =
            fuelFlowSettings.profile.phone || "";

    }


    if(adminRole){

        adminRole.value =
            fuelFlowSettings.profile.role ||
            "Administrator";

    }


    // ==============================
    // Pump Information
    // ==============================

    if(pumpName){

        pumpName.value =
            fuelFlowSettings.pump.name || "";

    }


    if(pumpLocation){

        pumpLocation.value =
            fuelFlowSettings.pump.location || "";

    }


    if(pumpPhone){

        pumpPhone.value =
            fuelFlowSettings.pump.phone || "";

    }


    if(pumpEmail){

        pumpEmail.value =
            fuelFlowSettings.pump.email || "";

    }


    if(pumpAddress){

        pumpAddress.value =
            fuelFlowSettings.pump.address || "";

    }


    // ==============================
    // Fuel Prices
    // ==============================

    if(petrolPrice){

        petrolPrice.value =
            fuelFlowSettings.fuelPrices.petrol;

    }


    if(dieselPrice){

        dieselPrice.value =
            fuelFlowSettings.fuelPrices.diesel;

    }


    // ==============================
    // Preferences
    // ==============================

    if(currency){

        currency.value =
            fuelFlowSettings.preferences.currency;

    }


    if(lowStockWarning){

        lowStockWarning.checked =
            fuelFlowSettings.preferences.lowStockWarning;

    }


    if(notifications){

        notifications.checked =
            fuelFlowSettings.preferences.notifications;

    }


    if(autoRefresh){

        autoRefresh.checked =
            fuelFlowSettings.preferences.autoRefresh;

    }


    // ==============================
    // Header Name
    // ==============================

    updateHeaderName();

}



// ==========================================
// Update Header Name
// ==========================================

function updateHeaderName(){

    if(!headerUserName){

        return;

    }


    const name =
        fuelFlowSettings.profile.name;


    headerUserName.textContent =
        name || "Admin";

}



// ==========================================
// Save Profile
// ==========================================

if(saveProfileBtn){

    saveProfileBtn.addEventListener(
        "click",
        function(){

            const name =
                adminName.value.trim();


            if(name === ""){

                alert(
                    "Please enter your full name."
                );

                adminName.focus();

                return;

            }


            fuelFlowSettings.profile.name =
                name;


            fuelFlowSettings.profile.email =
                adminEmail.value.trim();


            fuelFlowSettings.profile.phone =
                adminPhone.value.trim();


            saveSettings();


            updateHeaderName();


            alert(
                "Profile saved successfully!"
            );

        }
    );

}



// ==========================================
// Save Pump Information
// ==========================================

if(savePumpBtn){

    savePumpBtn.addEventListener(
        "click",
        function(){

            const name =
                pumpName.value.trim();


            if(name === ""){

                alert(
                    "Please enter the petrol pump name."
                );

                pumpName.focus();

                return;

            }


            fuelFlowSettings.pump.name =
                name;


            fuelFlowSettings.pump.location =
                pumpLocation.value.trim();


            fuelFlowSettings.pump.phone =
                pumpPhone.value.trim();


            fuelFlowSettings.pump.email =
                pumpEmail.value.trim();


            fuelFlowSettings.pump.address =
                pumpAddress.value.trim();


            saveSettings();


            alert(
                "Pump information saved successfully!"
            );

        }
    );

}



// ==========================================
// Save Fuel Prices
// ==========================================

if(saveFuelPriceBtn){

    saveFuelPriceBtn.addEventListener(
        "click",
        function(){

            const petrol =
                Number(petrolPrice.value);


            const diesel =
                Number(dieselPrice.value);


            if(
                petrol <= 0 ||
                diesel <= 0
            ){

                alert(
                    "Please enter valid fuel prices."
                );

                return;

            }


            fuelFlowSettings.fuelPrices.petrol =
                petrol;


            fuelFlowSettings.fuelPrices.diesel =
                diesel;


            saveSettings();


            // Also save separately
            // for other FuelFlow modules

            localStorage.setItem(
                "petrolPrice",
                petrol
            );


            localStorage.setItem(
                "dieselPrice",
                diesel
            );


            alert(
                "Fuel prices saved successfully!"
            );

        }
    );

}



// ==========================================
// Save System Preferences
// ==========================================

if(savePreferencesBtn){

    savePreferencesBtn.addEventListener(
        "click",
        function(){

            fuelFlowSettings.preferences.currency =
                currency.value;


            fuelFlowSettings.preferences.lowStockWarning =
                lowStockWarning.checked;


            fuelFlowSettings.preferences.notifications =
                notifications.checked;


            fuelFlowSettings.preferences.autoRefresh =
                autoRefresh.checked;


            saveSettings();


            alert(
                "Preferences saved successfully!"
            );

        }
    );

}



// ==========================================
// Password Toggle
// ==========================================

const passwordToggles =
    document.querySelectorAll(
        ".password-toggle"
    );


passwordToggles.forEach(
    function(button){

        button.addEventListener(
            "click",
            function(){

                const targetId =
                    button.dataset.target;


                const input =
                    document.getElementById(
                        targetId
                    );


                if(!input){

                    return;

                }


                if(input.type === "password"){

                    input.type = "text";


                    button.innerHTML =
                        '<i class="fa-solid fa-eye-slash"></i>';

                }

                else{

                    input.type = "password";


                    button.innerHTML =
                        '<i class="fa-solid fa-eye"></i>';

                }

            }
        );

    }
);



// ==========================================
// Change Password
// ==========================================

if(changePasswordBtn){

    changePasswordBtn.addEventListener(
        "click",
        function(){

            const currentPassword =
                document.getElementById(
                    "currentPassword"
                ).value;


            const newPassword =
                document.getElementById(
                    "newPassword"
                ).value;


            const confirmPassword =
                document.getElementById(
                    "confirmPassword"
                ).value;


            // ==================================
            // Default Login Password
            // ==================================

            const storedPassword =
                localStorage.getItem(
                    "adminPassword"
                ) || "admin@123";


            // ==================================
            // Validation
            // ==================================

            if(currentPassword === ""){

                alert(
                    "Please enter your current password."
                );

                return;

            }


            if(currentPassword !== storedPassword){

                alert(
                    "Current password is incorrect."
                );

                return;

            }


            if(newPassword.length < 6){

                alert(
                    "New password must contain at least 6 characters."
                );

                return;

            }


            if(newPassword !== confirmPassword){

                alert(
                    "New passwords do not match."
                );

                return;

            }


            // ==================================
            // Save New Password
            // ==================================

            localStorage.setItem(
                "adminPassword",
                newPassword
            );


            document.getElementById(
                "currentPassword"
            ).value = "";


            document.getElementById(
                "newPassword"
            ).value = "";


            document.getElementById(
                "confirmPassword"
            ).value = "";


            alert(
                "Password changed successfully!"
            );

        }
    );

}



// ==========================================
// Clear All Application Data
// ==========================================

if(clearDataBtn){

    clearDataBtn.addEventListener(
        "click",
        function(){

            const confirmation =
                confirm(

                    "WARNING!\n\n" +

                    "This will permanently delete:\n\n" +

                    "• Sales records\n" +

                    "• Inventory records\n" +

                    "• Customers\n" +

                    "• Employees\n" +

                    "• Expenses\n" +

                    "• Reports data\n\n" +

                    "Are you sure you want to continue?"

                );


            if(!confirmation){

                return;

            }


            const secondConfirmation =
                confirm(

                    "This action cannot be undone.\n\n" +

                    "Do you REALLY want to clear all FuelFlow data?"

                );


            if(!secondConfirmation){

                return;

            }


            // ==================================
            // Remove Application Data
            // ==================================

            localStorage.removeItem("sales");

            localStorage.removeItem("fuelStock");

            localStorage.removeItem(
                "inventoryHistory"
            );

            localStorage.removeItem(
                "customers"
            );

            localStorage.removeItem(
                "employees"
            );

            localStorage.removeItem(
                "expenses"
            );

            localStorage.removeItem(
                "lastInvoice"
            );


            // Keep settings

            alert(
                "Application data cleared successfully."
            );


            location.reload();

        }
    );

}



// ==========================================
// Logout
// ==========================================

if(logoutBtn){

    logoutBtn.addEventListener(
        "click",
        function(e){

            e.preventDefault();


            const confirmation =
                confirm(
                    "Are you sure you want to logout?"
                );


            if(!confirmation){

                return;

            }


            window.location.href =
                "index.html";

        }
    );

}



// ==========================================
// Update Fuel Price Everywhere
// ==========================================

function getFuelPrice(fuelType){

    if(
        fuelType === "Petrol"
    ){

        return Number(
            fuelFlowSettings.fuelPrices.petrol
        );

    }


    if(
        fuelType === "Diesel"
    ){

        return Number(
            fuelFlowSettings.fuelPrices.diesel
        );

    }


    return 0;

}



// Make Function Available Globally

window.getFuelPrice =
    getFuelPrice;



// ==========================================
// Get Current Settings
// ==========================================

window.getFuelFlowSettings =
    function(){

        return fuelFlowSettings;

    };



// ==========================================
// Initialize
// ==========================================

loadSettings();


// ==========================================
// FuelFlow Settings Loaded
// ==========================================

console.log(
    "FuelFlow Settings loaded successfully."
);