document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

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
        sessionStorage.setItem("isLoggedIn", "true");
        location.href = 'home.html';
        history.replaceState(null, '', 'home.html');
        alert('Logged in');
        
        
    })
    .catch((error) => {
        console.error("Error:", error);
        alert("Login failed. Please check your credentials.");
    });
});

