// ======================================================
// FuelFlow Login
// ======================================================

// Select Elements
const loginForm = document.getElementById("loginForm");
const username = document.getElementById("username");
const password = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const rememberMe = document.getElementById("rememberMe");
const loginBtn = document.getElementById("loginBtn");

// ------------------------------------------------------
// Remember Username
// ------------------------------------------------------

window.addEventListener("DOMContentLoaded", () => {

    const savedUsername = localStorage.getItem("fuelflow_username");

    if (savedUsername) {
        username.value = savedUsername;
        rememberMe.checked = true;
    }

});

// ------------------------------------------------------
// Show / Hide Password
// ------------------------------------------------------

togglePassword.addEventListener("click", () => {

    if (password.type === "password") {

        password.type = "text";

        togglePassword.classList.replace("fa-eye", "fa-eye-slash");

    } else {

        password.type = "password";

        togglePassword.classList.replace("fa-eye-slash", "fa-eye");

    }

});

// ------------------------------------------------------
// Login
// ------------------------------------------------------

loginForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const user = username.value.trim();
    const pass = password.value.trim();

    if (user === "") {

        alert("Please enter username.");

        username.focus();

        return;

    }

    if (pass === "") {

        alert("Please enter password.");

        password.focus();

        return;

    }

    loginBtn.disabled = true;
    loginBtn.innerHTML = "Signing In...";

    setTimeout(() => {

        if (user === "admin" && pass === "admin@123") {

            // Save username if Remember Me is checked
            if (rememberMe.checked) {

                localStorage.setItem("fuelflow_username", user);

            } else {

                localStorage.removeItem("fuelflow_username");

            }

            // Save login session
            sessionStorage.setItem("loggedIn", "true");

            // Redirect
            window.location.href = "dashboard.html";

        } else {

            alert("Invalid username or password.");

            loginBtn.disabled = false;
            loginBtn.innerHTML = "Sign In";

        }

    }, 1000);

});