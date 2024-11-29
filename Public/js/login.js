(function() {
    if (localStorage.getItem("token")) {
        const esadmin = localStorage.getItem("esadmin");
        if (esadmin === 'true') {
            document.location.href = "admin-dashboard.html";
        } else {
            document.location.href = "index.html";
        }
        console.log("Usuario ya en sesión");
        return;
    }

    document.body.style.display = "block";

    document.querySelector("#btn-login").addEventListener('click', async (e) => {
        e.preventDefault(); 

        const [validationIdentifier, validationPassword, msgError] =
            document.querySelectorAll("#validation-identifier, #validation-password, #msg-error-login");

        validationIdentifier.style.display = "none";
        validationPassword.style.display = "none";
        msgError.style.display = "none";

        const inputIdentifier = document.querySelector("#identifier");
        const inputPassword = document.querySelector("#password");
        let hasError = false;

        if (inputIdentifier.value.trim() === "") {
            hasError = true;
            validationIdentifier.style.display = "block";
        }
        if (inputPassword.value.trim() === "") {
            hasError = true;
            validationPassword.style.display = "block";
        }

        if (hasError) {
            return;
        }
        // creo un objeto

        const usuario = {
            "identifier": inputIdentifier.value,
            "contraseña": inputPassword.value
        };

        try {
            const response = await fetch('/api/usuario/login', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json', 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(usuario)
            });

            console.log("Respuesta del servidor:", response);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error en la autenticación');
            }

            const data = await response.json();
            console.log("Datos recibidos del servidor:", data);

            if (!data.token) {
                msgError.innerHTML = "Usuario y/o Contraseña son inválidos";
                msgError.style.display = "block";
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("esadmin", data.esadmin); 

            // Redirigir según el rol del usuario
            if (data.esadmin) {
                window.location.href = 'admin-dashboard.html';
            } else {
                window.location.href = 'index.html';
            }

        } catch (error) {
            console.error("Error durante el inicio de sesión:", error);
            msgError.innerHTML = error.message || "Usuario y/o Contraseña son inválidos";
            msgError.style.display = "block";
            return;
        }
    });

})();

