// document.getElementById("registerForm").addEventListener("submit", function (e) {
//     e.preventDefault();

//     const username = document.getElementById("username").value;
//     const email = document.getElementById("email").value;
//     const password = document.getElementById("password").value;
//     const confirmPassword = document.getElementById("confirmPassword").value;

//     fetch("http://127.0.0.1:8000/api/accounts/register/", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//             username: username,
//             email: email,
//             password: password,
//             confirm_password: confirmPassword,
//         }),
//     })
//     .then(response => {
//         // Check if the response status is OK (i.e. 2xx)
//         if (response.ok) {
//             alert("User registered successfully. Check your email for OTP.");
//             return response.json();  // Parse response as JSON
//         } else {
//             // If response is not OK, throw an error with status
//             return response.json().then(errorData => {
//                 throw new Error(JSON.stringify(errorData));  // Pass error details for later use
//             });
//         }
//     })
//     .then(data => {
//         console.log("Success:", data);
//         alert("User registered successfully. Check your email for OTP.");
//         // // Redirect after successful registration
//         // window.location.href = "/login";  // Change this to the path you want to redirect to
//     })
//     .catch(error => {
//         console.error("Error:", error);

//         const errorData = JSON.parse(error.message); // Parse the error message back into a JSON object
//         if (errorData.non_field_errors) {
//             console.error("Error:", errorData.non_field_errors[0]);
//             alert("Error: " + errorData.non_field_errors[0]);
//         } else if (errorData.username) {
//             alert("Username: " + errorData.username[0]);
//         } else if (errorData.email) {
//             alert("Email: " + errorData.email[0]);
//         } else if (errorData.password) {
//             alert("Password: " + errorData.password[0]);
//         }
//     });
// });

document.getElementById("registerForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    fetch("http://127.0.0.1:8000/api/accounts/register/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: username,
            email: email,
            password: password,
            confirm_password: confirmPassword, // Ensure this matches the serializer
        }),
    })
    .then(response => {
        // Check if the response status is OK (i.e. 2xx)
        if (response.ok) {
            return response.json();  // Parse response as JSON
        } else {
            // If response is not OK, throw an error with status
            return response.json().then(errorData => {
                throw new Error(JSON.stringify(errorData));  // Pass error details for later use
            });
        }
    })
    .then(data => {
        console.log("Success:", data);
        alert("User registered successfully. Check your email for OTP.");
        // Redirect after successful registration
        window.location.href = "/login";  // Change this to the path you want to redirect to
    })
    .catch(error => {
        console.error("Error:", error);

        let errorData;
        try {
            errorData = JSON.parse(error.message); // Parse the error message back into a JSON object
        } catch (e) {
            alert("An unknown error occurred."); // Handle cases where error.message isn't JSON
            return;
        }

        // Display appropriate error messages based on the response
        let alertMessage = "Errors: \n";
        if (errorData.non_field_errors) {
            alertMessage += errorData.non_field_errors[0] + "\n";
        }
        if (errorData.username) {
            alertMessage += "Username: " + errorData.username[0] + "\n";
        }
        if (errorData.email) {
            alertMessage += "Email: " + errorData.email[0] + "\n";
        }
        if (errorData.password) {
            alertMessage += "Password: " + errorData.password[0] + "\n";
        }

        alert(alertMessage.trim()); // Show all errors in a single alert
    });
});

