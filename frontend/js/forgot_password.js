document.getElementById("forgotEmailForm").addEventListener("submit", function (e) {
    e.preventDefault();

    // const csrftoken = getCookie('csrftoken'); // Retrieve the CSRF token

    const email = document.getElementById("email").value;

    fetch("http://127.0.0.1:8000/api/accounts/forgot-password/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: email,
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
        sessionStorage.setItem("email",email);
        sessionStorage.setItem("verifyotp", data.otp);
        location.href = "reset-otp.html";  // Change this to the path you want to redirect to
        
        alert("Check your email for OTP.");
        // Redirect after successful registration
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
       // Display error message for OTP
       alert("Error: "+errorData.error);  // Show all errors in a single aler
    });
});


