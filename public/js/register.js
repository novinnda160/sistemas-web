document.getElementById('registerForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/api/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fullName, email, address, username, password }),
        });

        if (response.ok) {
            alert('Registro realizado com sucesso! Você pode fazer login agora.');
            window.location.href = 'login.html'; // Redireciona para a página de login
        } else {
            const errorMessage = await response.text();
            alert(errorMessage);
        }
    } catch (error) {
        console.error('Erro no registro:', error);
        alert('Erro ao registrar. Tente novamente.');
    }
});
