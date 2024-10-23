document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Impede o comportamento padrão do formulário

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    const response = await fetch('http://localhost:3000/api/painel-adm', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
    });

    if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token); // Armazena o token no localStorage
        window.location.href = '/home'; // Redireciona para a página inicial
    } else {
        const error = await response.json();
        alert(error.message); // Exibe mensagem de erro
    }
});
