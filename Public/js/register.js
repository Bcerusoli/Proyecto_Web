document.addEventListener('DOMContentLoaded', () => {
    document.querySelector("#register-form").addEventListener('submit', async (e) => {
        e.preventDefault(); 

        const [validationFullName, validationUsername, validationEmail, validationPassword, validationAddress, msgError] =
            document.querySelectorAll("#validation-full_name, #validation-username, #validation-email, #validation-password, #validation-address, #msg-error-register");

        validationFullName.style.display = "none";
        validationUsername.style.display = "none";
        validationEmail.style.display = "none";
        validationPassword.style.display = "none";
        validationAddress.style.display = "none";
        msgError.style.display = "none";

        const inputFullName = document.querySelector("#full_name");
        const inputUsername = document.querySelector("#username");
        const inputEmail = document.querySelector("#email");
        const inputPassword = document.querySelector("#contraseña");
        const inputNit = document.querySelector("#nit");
        const inputAddress = document.querySelector("#address");
        let hasError = false;

        if (inputFullName.value.trim() === "") {
            hasError = true;
            validationFullName.style.display = "block";
        }
        if (inputUsername.value.trim() === "") {
            hasError = true;
            validationUsername.style.display = "block";
        }
        if (inputEmail.value.trim() === "") {
            hasError = true;
            validationEmail.style.display = "block";
        }
        if (inputPassword.value.trim() === "") {
            hasError = true;
            validationPassword.style.display = "block";
        }
        if (inputAddress.value.trim() === "") {
            hasError = true;
            validationAddress.style.display = "block";
        }

        if (hasError) {
            return;
        }

        const usuario = {
            full_name: inputFullName.value,
            username: inputUsername.value,
            email: inputEmail.value,
            contraseña: inputPassword.value,
            nit: inputNit.value,
            address: inputAddress.value
        };

        console.log("Datos de usuario enviados:", usuario);

        try {
            const response = await fetch('/api/usuario/register', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json', 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(usuario)
            });

            const data = await response.json();
            console.log("Respuesta del servidor:", response);

            if (response.ok) {
                
                msgError.innerHTML = "Cuenta creada exitosamente";
                msgError.style.color = "green";
                msgError.style.display = "block";
               
                window.location.href = 'login.html';
            } else {
                msgError.innerHTML = data.message || 'Error al registrar usuario.';
                msgError.style.display = "block";
            }
        } catch (error) {
            console.error('Error durante el registro:', error);
            msgError.textContent = 'Error al registrar usuario. Inténtalo más tarde.';
            msgError.style.display = "block";
        }
    });
});