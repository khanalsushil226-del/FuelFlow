// ==========================================
// FuelFlow Settings Module
// ==========================================


// ==========================================
// Load Settings From LocalStorage
// ==========================================

let fuelFlowSettings =
    JSON.parse(
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

function saveSettings() {

    localStorage.setItem(
        "fuelFlowSettings",
        JSON.stringify(fuelFlowSettings)
    );

}


// ==========================================
// Get Elements
// ==========================================


// ------------------------------------------
// Profile
// ------------------------------------------

const adminName =
    document.getElementById("adminName");

const adminEmail =
    document.getElementById("adminEmail");

const adminPhone =
    document.getElementById("adminPhone");

const adminRole =
    document.getElementById("adminRole");


// ------------------------------------------
// Pump
// ------------------------------------------

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


// ------------------------------------------
// Fuel Prices
// ------------------------------------------

const petrolPrice =
    document.getElementById("petrolPrice");

const dieselPrice =
    document.getElementById("dieselPrice");


// ------------------------------------------
// Preferences
// ------------------------------------------

const currency =
    document.getElementById("currency");

const lowStockWarning =
    document.getElementById("lowStockWarning");

const notifications =
    document.getElementById("notifications");

const autoRefresh =
    document.getElementById("autoRefresh");


// ------------------------------------------
// Header
// ------------------------------------------

const headerUserName =
    document.getElementById("headerUserName");


// ------------------------------------------
// Buttons
// ------------------------------------------

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
// ADMIN DATA PROTECTION PIN
// ==========================================
//
// This PIN protects the "Clear All Application Data"
// action.
//
// Storage key:
// adminDataPin
//
// The PIN must always contain exactly 4 digits.
// ==========================================


const ADMIN_PIN_KEY =
    "adminDataPin";


// ==========================================
// Get Stored Admin PIN
// ==========================================

function getAdminPin() {

    return localStorage.getItem(
        ADMIN_PIN_KEY
    );

}


// ==========================================
// Validate PIN Format
// ==========================================

function isValidAdminPin(pin) {

    return /^\d{4}$/.test(pin);

}


// ==========================================
// Create Admin PIN
// ==========================================
//
// Used when the system does not have a PIN yet.
// ==========================================

function setupAdminPin() {

    let firstPin;

    let secondPin;


    while (true) {

        firstPin = prompt(
            "ADMIN DATA PROTECTION\n\n" +
            "No Admin PIN has been created yet.\n\n" +
            "Create a unique 4-digit PIN to protect " +
            "the Clear All Application Data feature."
        );


        // User cancelled
        if (firstPin === null) {

            return false;

        }


        firstPin =
            firstPin.trim();


        if (!isValidAdminPin(firstPin)) {

            alert(
                "Invalid PIN.\n\n" +
                "Your Admin PIN must contain exactly 4 digits."
            );

            continue;

        }


        secondPin = prompt(
            "Confirm your new 4-digit Admin PIN:"
        );


        // User cancelled
        if (secondPin === null) {

            return false;

        }


        secondPin =
            secondPin.trim();


        if (firstPin !== secondPin) {

            alert(
                "PINs do not match.\n\n" +
                "Please try again."
            );

            continue;

        }


        localStorage.setItem(
            ADMIN_PIN_KEY,
            firstPin
        );


        alert(
            "Admin PIN created successfully.\n\n" +
            "This PIN will be required before " +
            "all application data can be deleted."
        );


        return true;

    }

}


// ==========================================
// Verify Admin PIN
// ==========================================

function verifyAdminPin() {

    let storedPin =
        getAdminPin();


    // --------------------------------------
    // First-time setup
    // --------------------------------------

    if (!storedPin) {

        const created =
            setupAdminPin();


        if (!created) {

            return false;

        }


        storedPin =
            getAdminPin();

    }


    // --------------------------------------
    // Ask for PIN
    // --------------------------------------

    const enteredPin =
        prompt(
            "ADMIN VERIFICATION\n\n" +
            "Enter your 4-digit Admin PIN to continue:"
        );


    // User cancelled
    if (enteredPin === null) {

        return false;

    }


    const cleanPin =
        enteredPin.trim();


    // --------------------------------------
    // Validate format
    // --------------------------------------

    if (!isValidAdminPin(cleanPin)) {

        alert(
            "Invalid PIN.\n\n" +
            "Please enter exactly 4 digits."
        );

        return false;

    }


    // --------------------------------------
    // Verify
    // --------------------------------------

    if (cleanPin !== storedPin) {

        alert(
            "Access denied.\n\n" +
            "The Admin PIN is incorrect.\n\n" +
            "No data has been deleted."
        );

        return false;

    }


    return true;

}


// ==========================================
// Add Admin PIN Management To Security
// ==========================================

function addAdminPinSecurity() {

    const securityCard =
        changePasswordBtn
            ? changePasswordBtn.closest(".settings-card")
            : null;


    if (!securityCard) {

        return;

    }


    // Prevent duplicate creation
    if (
        document.getElementById(
            "adminPinManagement"
        )
    ) {

        return;

    }


    const securityActions =
        changePasswordBtn.closest(
            ".settings-actions"
        );


    if (!securityActions) {

        return;

    }


    const pinContainer =
        document.createElement("div");


    pinContainer.id =
        "adminPinManagement";

    pinContainer.style.marginTop =
        "20px";

    pinContainer.style.paddingTop =
        "20px";

    pinContainer.style.borderTop =
        "1px solid #e5e7eb";


    pinContainer.innerHTML = `

        <div style="
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap:20px;
            flex-wrap:wrap;
        ">

            <div>

                <strong style="
                    display:block;
                    margin-bottom:5px;
                ">
                    Admin Data Protection PIN
                </strong>

                <p style="
                    margin:0;
                    color:#6b7280;
                    font-size:14px;
                ">
                    A unique 4-digit PIN is required
                    before permanently deleting
                    FuelFlow application data.
                </p>

            </div>


            <button
                type="button"
                id="changeAdminPinBtn"
                class="settings-save-btn"
            >

                <i class="fa-solid fa-shield-halved"></i>

                Change Admin PIN

            </button>

        </div>

    `;


    securityActions.appendChild(
        pinContainer
    );


    // --------------------------------------
    // Change PIN button
    // --------------------------------------

    const changeAdminPinBtn =
        document.getElementById(
            "changeAdminPinBtn"
        );


    if (changeAdminPinBtn) {

        changeAdminPinBtn.addEventListener(
            "click",
            changeAdminPin
        );

    }

}


// ==========================================
// Change Admin PIN
// ==========================================

function changeAdminPin() {

    const existingPin =
        getAdminPin();


    // --------------------------------------
    // If no PIN exists
    // --------------------------------------

    if (!existingPin) {

        setupAdminPin();

        return;

    }


    // --------------------------------------
    // Verify current PIN first
    // --------------------------------------

    const currentPin =
        prompt(
            "CHANGE ADMIN PIN\n\n" +
            "Enter your current 4-digit Admin PIN:"
        );


    if (currentPin === null) {

        return;

    }


    if (
        !isValidAdminPin(
            currentPin.trim()
        )
    ) {

        alert(
            "Invalid PIN.\n\n" +
            "The PIN must contain exactly 4 digits."
        );

        return;

    }


    if (
        currentPin.trim() !==
        existingPin
    ) {

        alert(
            "Current Admin PIN is incorrect.\n\n" +
            "PIN was not changed."
        );

        return;

    }


    // --------------------------------------
    // New PIN
    // --------------------------------------

    const newPin =
        prompt(
            "Enter your new unique 4-digit Admin PIN:"
        );


    if (newPin === null) {

        return;

    }


    const cleanNewPin =
        newPin.trim();


    if (!isValidAdminPin(cleanNewPin)) {

        alert(
            "Invalid PIN.\n\n" +
            "The new PIN must contain exactly 4 digits."
        );

        return;

    }


    // --------------------------------------
    // Confirm new PIN
    // --------------------------------------

    const confirmPin =
        prompt(
            "Confirm your new 4-digit Admin PIN:"
        );


    if (confirmPin === null) {

        return;

    }


    const cleanConfirmPin =
        confirmPin.trim();


    if (
        cleanNewPin !==
        cleanConfirmPin
    ) {

        alert(
            "PINs do not match.\n\n" +
            "Your Admin PIN was not changed."
        );

        return;

    }


    // --------------------------------------
    // Prevent same PIN
    // --------------------------------------

    if (
        cleanNewPin ===
        existingPin
    ) {

        alert(
            "Your new PIN must be different " +
            "from your current PIN."
        );

        return;

    }


    // --------------------------------------
    // Save new PIN
    // --------------------------------------

    localStorage.setItem(
        ADMIN_PIN_KEY,
        cleanNewPin
    );


    alert(
        "Admin PIN changed successfully."
    );

}


// ==========================================
// Load Settings Into Form
// ==========================================

function loadSettings() {


    // ======================================
    // Profile
    // ======================================

    if (adminName) {

        adminName.value =
            fuelFlowSettings.profile.name || "";

    }


    if (adminEmail) {

        adminEmail.value =
            fuelFlowSettings.profile.email || "";

    }


    if (adminPhone) {

        adminPhone.value =
            fuelFlowSettings.profile.phone || "";

    }


    if (adminRole) {

        adminRole.value =
            fuelFlowSettings.profile.role ||
            "Administrator";

    }


    // ======================================
    // Pump Information
    // ======================================

    if (pumpName) {

        pumpName.value =
            fuelFlowSettings.pump.name || "";

    }


    if (pumpLocation) {

        pumpLocation.value =
            fuelFlowSettings.pump.location || "";

    }


    if (pumpPhone) {

        pumpPhone.value =
            fuelFlowSettings.pump.phone || "";

    }


    if (pumpEmail) {

        pumpEmail.value =
            fuelFlowSettings.pump.email || "";

    }


    if (pumpAddress) {

        pumpAddress.value =
            fuelFlowSettings.pump.address || "";

    }


    // ======================================
    // Fuel Prices
    // ======================================

    if (petrolPrice) {

        petrolPrice.value =
            fuelFlowSettings.fuelPrices.petrol;

    }


    if (dieselPrice) {

        dieselPrice.value =
            fuelFlowSettings.fuelPrices.diesel;

    }


    // ======================================
    // Preferences
    // ======================================

    if (currency) {

        currency.value =
            fuelFlowSettings.preferences.currency;

    }


    if (lowStockWarning) {

        lowStockWarning.checked =
            fuelFlowSettings.preferences.lowStockWarning;

    }


    if (notifications) {

        notifications.checked =
            fuelFlowSettings.preferences.notifications;

    }


    if (autoRefresh) {

        autoRefresh.checked =
            fuelFlowSettings.preferences.autoRefresh;

    }


    // ======================================
    // Header Name
    // ======================================

    updateHeaderName();

}


// ==========================================
// Update Header Name
// ==========================================

function updateHeaderName() {

    if (!headerUserName) {

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

if (saveProfileBtn) {

    saveProfileBtn.addEventListener(
        "click",
        function () {

            const name =
                adminName.value.trim();


            if (name === "") {

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

if (savePumpBtn) {

    savePumpBtn.addEventListener(
        "click",
        function () {

            const name =
                pumpName.value.trim();


            if (name === "") {

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

if (saveFuelPriceBtn) {

    saveFuelPriceBtn.addEventListener(
        "click",
        function () {

            const petrol =
                Number(
                    petrolPrice.value
                );


            const diesel =
                Number(
                    dieselPrice.value
                );


            if (
                petrol <= 0 ||
                diesel <= 0
            ) {

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


            // ----------------------------------
            // Save separately for other modules
            // ----------------------------------

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

if (savePreferencesBtn) {

    savePreferencesBtn.addEventListener(
        "click",
        function () {

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
    function (button) {

        button.addEventListener(
            "click",
            function () {

                const targetId =
                    button.dataset.target;


                const input =
                    document.getElementById(
                        targetId
                    );


                if (!input) {

                    return;

                }


                if (
                    input.type ===
                    "password"
                ) {

                    input.type =
                        "text";


                    button.innerHTML =
                        '<i class="fa-solid fa-eye-slash"></i>';

                }

                else {

                    input.type =
                        "password";


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

if (changePasswordBtn) {

    changePasswordBtn.addEventListener(
        "click",
        function () {

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


            // ----------------------------------
            // Default Login Password
            // ----------------------------------

            const storedPassword =
                localStorage.getItem(
                    "adminPassword"
                ) || "admin@123";


            // ----------------------------------
            // Validation
            // ----------------------------------

            if (
                currentPassword === ""
            ) {

                alert(
                    "Please enter your current password."
                );

                return;

            }


            if (
                currentPassword !==
                storedPassword
            ) {

                alert(
                    "Current password is incorrect."
                );

                return;

            }


            if (
                newPassword.length < 6
            ) {

                alert(
                    "New password must contain at least 6 characters."
                );

                return;

            }


            if (
                newPassword !==
                confirmPassword
            ) {

                alert(
                    "New passwords do not match."
                );

                return;

            }


            // ----------------------------------
            // Save New Password
            // ----------------------------------

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
// CLEAR ALL APPLICATION DATA
// ==========================================
//
// IMPORTANT:
// This action is protected by:
// 1. First confirmation
// 2. Second confirmation
// 3. Unique 4-digit Admin PIN
//
// ==========================================

if (clearDataBtn) {

    clearDataBtn.addEventListener(
        "click",
        function () {


            // ==================================
            // FIRST CONFIRMATION
            // ==================================

            const confirmation =
                confirm(

                    "⚠️ WARNING!\n\n" +

                    "This will permanently delete:\n\n" +

                    "• Sales records\n" +
                    "• Inventory records\n" +
                    "• Customers\n" +
                    "• Employees\n" +
                    "• Expenses\n" +
                    "• Reports data\n\n" +

                    "Your FuelFlow settings will NOT be deleted.\n\n" +

                    "Are you sure you want to continue?"

                );


            if (!confirmation) {

                return;

            }


            // ==================================
            // SECOND CONFIRMATION
            // ==================================

            const secondConfirmation =
                confirm(

                    "⚠️ FINAL WARNING!\n\n" +

                    "This action cannot be undone.\n\n" +

                    "All business data will be permanently removed.\n\n" +

                    "Do you REALLY want to continue?"

                );


            if (!secondConfirmation) {

                return;

            }


            // ==================================
            // ADMIN PIN VERIFICATION
            // ==================================

            const verified =
                verifyAdminPin();


            if (!verified) {

                return;

            }


            // ==================================
            // FINAL CONFIRMATION
            // ==================================

            const finalConfirmation =
                confirm(

                    "🔐 ADMIN VERIFIED\n\n" +

                    "You are about to permanently delete " +
                    "all FuelFlow application data.\n\n" +

                    "Click OK to permanently delete the data."

                );


            if (!finalConfirmation) {

                return;

            }


            // ==================================
            // REMOVE APPLICATION DATA
            // ==================================

            localStorage.removeItem(
                "sales"
            );


            localStorage.removeItem(
                "fuelStock"
            );


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


            // ----------------------------------
            // Remove other possible report data
            // ----------------------------------

            localStorage.removeItem(
                "reports"
            );


            localStorage.removeItem(
                "salesHistory"
            );


            // ----------------------------------
            // IMPORTANT:
            // Keep settings and Admin PIN.
            // ----------------------------------


            alert(

                "Application data cleared successfully.\n\n" +

                "All sales, inventory, customers, " +
                "employees and expenses data has been removed.\n\n" +

                "Your FuelFlow settings and Admin PIN " +
                "have been preserved."

            );


            // ----------------------------------
            // Reload application
            // ----------------------------------

            location.reload();

        }
    );

}


// ==========================================
// Logout
// ==========================================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function (e) {

            e.preventDefault();


            const confirmation =
                confirm(
                    "Are you sure you want to logout?"
                );


            if (!confirmation) {

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

function getFuelPrice(fuelType) {


    if (
        fuelType === "Petrol"
    ) {

        return Number(
            fuelFlowSettings
                .fuelPrices
                .petrol
        );

    }


    if (
        fuelType === "Diesel"
    ) {

        return Number(
            fuelFlowSettings
                .fuelPrices
                .diesel
        );

    }


    return 0;

}


// ==========================================
// Make Function Available Globally
// ==========================================

window.getFuelPrice =
    getFuelPrice;


// ==========================================
// Get Current Settings
// ==========================================

window.getFuelFlowSettings =
    function () {

        return fuelFlowSettings;

    };


// ==========================================
// Initialize
// ==========================================

loadSettings();


// ==========================================
// Add Admin PIN Management
// ==========================================

addAdminPinSecurity();


// ==========================================
// FuelFlow Settings Loaded
// ==========================================

console.log(
    "FuelFlow Settings loaded successfully."
);