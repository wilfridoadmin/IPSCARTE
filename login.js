document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        // Aquí puedes agregar la lógica de autenticación
        if (username === "admin" && password === "0204") {
            localStorage.setItem("user", username);
            window.location.href = "index.html"; // Redirigir al inicio
        } else if (username === "psicologa" && password === "221099") {
            localStorage.setItem("user", username);
            window.location.href = "index.html"; // Redirigir al inicio
        } else {
            alert("Credenciales incorrectas");
        }
    });
});
