document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Previne o comportamento padrão do formulário

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/loggins', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, senha: password }), // Enviar e-mail e senha
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert(errorData.message); // Mostra mensagem de erro
            return;
        }

        // Se o login for bem-sucedido, redirecionar para a página do dashboard
        window.location.href = '/dashboard.html'; // Certifique-se de que este caminho está correto
    } catch (error) {
        console.error('Erro ao realizar login:', error);
        alert('Erro ao realizar login. Tente novamente mais tarde.');
    }
});
