document.getElementById("resetPasswordForm").addEventListener("submit", function(e) {
    e.preventDefault();
    console.log("Reset password");

    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const email = sessionStorage.getItem("email");
    
    console.log(password);
    console.log(confirmPassword);
    fetch("http://127.0.0.1:8000/api/accounts/reset-password/", {
        method: "POST", 
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: email,
            password: password,
            confirm_password: confirmPassword
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
        sessionStorage.clear();
        location.href = "login.html";  // Change this to the path you want to redirect to
        alert("Password changed successfully"); 
    })
    .catch(error => {
        let errorData;
        let alertMessage = "";
        try {
            errorData = JSON.parse(error.message); // Parse the error message back into a JSON object
        } catch (e) {
            alert("An unknown error occurred."); // Handle cases where error.message isn't JSON
            return;
        }
        if (errorData.password) {
            alertMessage += "Password: " + errorData.password[0] + "\n";
            alert("Error: "+ alertMessage); 
        }
        else{
            alert("Error: "+errorData.error);  // Show all errors in a single alert
        }
    });
});


