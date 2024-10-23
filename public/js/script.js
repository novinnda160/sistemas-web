
// Função para atualizar números de clientes e tickets em tempo real
function updateRealTimeData() {
    // Exemplo de dados fictícios
    const activeClients = Math.floor(Math.random() * 100);
    const inactiveClients = Math.floor(Math.random() * 50);
    const totalTickets = Math.floor(Math.random() * 20);

    const activeClientsElem = document.getElementById('activeClients');
    const inactiveClientsElem = document.getElementById('inactiveClients');
    const totalTicketsElem = document.getElementById('totalTickets');

    if (activeClientsElem) {
        activeClientsElem.innerText = activeClients;
    } else {
        console.error('Elemento activeClients não encontrado');
    }

    if (inactiveClientsElem) {
        inactiveClientsElem.innerText = inactiveClients;
    } else {
        console.error('Elemento inactiveClients não encontrado');
    }

    if (totalTicketsElem) {
        totalTicketsElem.innerText = totalTickets;
    } else {
        console.error('Elemento totalTickets não encontrado');
    }
}

// Adicionar cliente à lista
$(document).ready(function() {
    // Evento para adicionar cliente
    $('#addClientBtn').on('click', function() {
        const clientName = $('#clientInput').val().trim(); // Remove espaços em branco
        if (clientName) {
            $('#clientList').append(`<li class="list-group-item">${clientName}</li>`);
            $('#clientInput').val(''); // Limpa o campo de entrada
        } else {
            alert('Por favor, insira um nome de cliente.');
        }
    });

    // Evento para criar cliente via API
    $('#botaoCriarCliente').on('click', async () => {
        const clienteData = {
            nome: $('#clientInput').val().trim(), // Obtém o nome do cliente do campo de entrada
        };

        if (!clienteData.nome) {
            alert('Por favor, insira um nome de cliente.');
            return;
        }

        try {
            const response = await fetch('/api/clients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(clienteData),
            });

            if (!response.ok) {
                throw new Error('Erro ao criar cliente');
            }

            const result = await response.json();
            alert(result.message || 'Cliente criado com sucesso!');

            // Adiciona o cliente à lista na interface
            $('#clientList').append(`<li class="list-group-item">${clienteData.nome}</li>`);
            $('#clientInput').val(''); // Limpa o campo de entrada após criar o cliente
        } catch (error) {
            console.error('Erro:', error);
            alert('Ocorreu um erro ao criar o cliente.');
        }
    });

    // Atualizar dados a cada 5 segundos
    setInterval(updateRealTimeData, 5000);
});