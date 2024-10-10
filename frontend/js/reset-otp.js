document.getElementById("resetOtpForm").addEventListener("submit", function (e) {
    e.preventDefault();
    console.log("Send otp for resetting");

    const otp = document.getElementById("otp").value;
    const email = sessionStorage.getItem("email");
    const ogotp = sessionStorage.getItem("verifyotp")

    
    fetch("http://127.0.0.1:8000/api/accounts/verify-otp/", {
        method: "POST", 
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            reset: 'true',
            email: email,
            ogotp: ogotp,
            otp: otp  // Send OTP to backend
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
        location.href = "reset-password.html";  // Change this to the path you want to redirect to
        alert("Reset Password link activated"); 
        // Redirect after successful registration
    })
    .catch(error => {
        let errorData;
        try {
            errorData = JSON.parse(error.message); // Parse the error message back into a JSON object
        } catch (e) {
            alert("An unknown error occurred."); // Handle cases where error.message isn't JSON
            return;
        }
       // Display error message for OTP
       alert("Error: "+errorData.error);  // Show all errors in a single alert
    });
});


