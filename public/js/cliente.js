
document.addEventListener("DOMContentLoaded", function() {
    const clientForm = document.getElementById('clientForm');
    const clientIdInput = document.getElementById('clientId');
    const clientList = document.getElementById('clientList');

    // Carregar clientes ao iniciar
    loadClients();

    // Manipular a submissão do formulário
    clientForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o envio padrão do formulário

        const clientData = {
            nome: document.getElementById('nome').value,
            cpf: document.getElementById('cpf').value,
            enderecoColeta: document.getElementById('enderecoColeta').value,
            email: document.getElementById('email').value
        };

        const clientId = clientIdInput.value;

        if (clientId) {
            // Atualizar cliente existente
            updateClient(clientId, clientData);
        } else {
            // Criar um novo cliente
            createClient(clientData);
        }
    });

    // Função para criar um novo cliente
    function createClient(clientData) {
        fetch('http://localhost:3000/api/clientes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(clientData)
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            loadClients(); // Atualiza a lista de clientes
            clientForm.reset(); // Reseta o formulário
        })
        .catch(error => alert('Erro ao cadastrar cliente: ' + error.message));
    }

    // Função para carregar a lista de clientes
    function loadClients() {
        fetch('http://localhost:3000/api/clientes')
            .then(response => response.json())
            .then(data => {
                clientList.innerHTML = ''; // Limpa a tabela antes de adicionar novos dados
                data.forEach(client => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${client.nome}</td>
                        <td>${client.cpf}</td>
                        <td>${client.enderecoColeta}</td>
                        <td>${client.email}</td>
                        <td>
                            <button class="edit-btn btn btn-sm btn-warning" data-id="${client.id}">Editar</button>
                            <button class="delete-btn btn btn-sm btn-danger" data-id="${client.id}">Deletar</button>
                        </td>
                    `;
                    clientList.appendChild(row);
                });

                // Adiciona os eventos de clique aos botões "Editar" e "Deletar"
                document.querySelectorAll('.edit-btn').forEach(button => {
                    button.addEventListener('click', function() {
                        const clientId = this.getAttribute('data-id');
                        editClient(clientId);
                    });
                });

                document.querySelectorAll('.delete-btn').forEach(button => {
                    button.addEventListener('click', function() {
                        const clientId = this.getAttribute('data-id');
                        deleteClient(clientId);
                    });
                });
            })
            .catch(error => alert('Erro ao carregar clientes: ' + error.message));
    }

    // Função para editar um cliente
    function editClient(clientId) {
        fetch(`http://localhost:3000/api/clientes/${clientId}`)
            .then(response => response.json())
            .then(client => {
                clientIdInput.value = client.id;
                document.getElementById('nome').value = client.nome;
                document.getElementById('cpf').value = client.cpf;
                document.getElementById('enderecoColeta').value = client.enderecoColeta;
                document.getElementById('email').value = client.email;
            })
            .catch(error => alert('Erro ao carregar cliente: ' + error.message));
    }

    // Função para atualizar um cliente
    function updateClient(clientId, clientData) {
        fetch(`http://localhost:3000/api/clientes/${clientId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(clientData)
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            loadClients(); // Atualiza a lista de clientes
            clientForm.reset(); // Reseta o formulário
            clientIdInput.value = ''; // Limpa o campo oculto
        })
        .catch(error => alert('Erro ao atualizar cliente: ' + error.message));
    }

    // Função para deletar um cliente
    function deleteClient(clientId) {
        if (confirm('Você tem certeza que deseja deletar este cliente?')) {
            fetch(`http://localhost:3000/api/clientes/${clientId}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                loadClients(); // Atualiza a lista de clientes
            })
            .catch(error => alert('Erro ao deletar cliente: ' + error.message));
        }
    }
});