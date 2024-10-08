document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    console.log("Form submitted"); 

    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    fetch("http://127.0.0.1:8000/api/accounts/login/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: username,
            password: password,
        }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Login failed");
            }
            return response.json();
        })
        .then(data => {
        console.log("Success:", data);
        alert("Logged in");
        // Redirect after successful registration
        window.location.href = "/login";  // Change this to the path you want to redirect to
    })
        .catch((error) => {
            console.error("Error:", error);
            alert("Login failed. Please check your credentials.");
        });
});

