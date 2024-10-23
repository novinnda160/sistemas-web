document.addEventListener('DOMContentLoaded', () => {
    // Seleção de elementos
    const clientesTableBody = document.getElementById('clientesTableBody');
    const motoboysTableBody = document.getElementById('motoboysTableBody');
    const totalCorridas = document.getElementById('totalCorridas');
    const faturamento = document.getElementById('faturamento');
    const gastosMotoboys = document.getElementById('gastosMotoboys');

    let socket = new WebSocket('ws://localhost:3000'); // Substitua pela URL do seu servidor WebSocket

    // Função para carregar clientes
    async function loadClients() {
        try {
            const response = await fetch('/api/clientes');
            const clients = await response.json();
            clientesTableBody.innerHTML = '';
            clients.forEach(client => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${client.id}</td>
                    <td>${client.name}</td>
                    <td>${client.email}</td>
                    <td>
                        <button onclick="openEditModal('client', '${client.id}', '${client.name}', '${client.email}')">Editar</button>
                        <button onclick="deleteClient('client', '${client.id}')">Excluir</button>
                    </td>
                `;
                clientesTableBody.appendChild(tr);
            });
        } catch (error) {
            console.error('Erro ao carregar clientes:', error);
        }
    }

    // Função para carregar motoboys
    async function loadMotoboys() {
        try {
            const response = await fetch('/api/motoboys');
            const motoboys = await response.json();
            motoboysTableBody.innerHTML = '';
            motoboys.forEach(motoboy => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${motoboy.id}</td>
                    <td>${motoboy.name}</td>
                    <td>${motoboy.email}</td>
                    <td>
                        <button onclick="openEditModal('motoboy', '${motoboy.id}', '${motoboy.name}', '${motoboy.email}')">Editar</button>
                        <button onclick="deleteClient('motoboy', '${motoboy.id}')">Excluir</button>
                    </td>
                `;
                motoboysTableBody.appendChild(tr);
            });
        } catch (error) {
            console.error('Erro ao carregar motoboys:', error);
        }
    }

    // Função para atualizar estatísticas do dashboard
    async function loadDashboardStats() {
        try {
            const response = await fetch('/api/dashboard/stats');
            const stats = await response.json();
            totalCorridas.innerText = stats.totalCorridas;
            faturamento.innerText = `R$ ${stats.faturamento.toFixed(2)}`;
            gastosMotoboys.innerText = `R$ ${stats.gastosMotoboys.toFixed(2)}`;
        } catch (error) {
            console.error('Erro ao carregar estatísticas do dashboard:', error);
        }
    }

    // Função para adicionar cliente
    async function addClient(name, email) {
        try {
            await fetch('/api/clientes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email })
            });
            loadClients();
        } catch (error) {
            console.error('Erro ao adicionar cliente:', error);
        }
    }

    // Função para adicionar motoboy
    async function addMotoboy(name, email) {
        try {
            await fetch('/api/motoboys', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email })
            });
            loadMotoboys();
        } catch (error) {
            console.error('Erro ao adicionar motoboy:', error);
        }
    }

    // Função para editar cliente/motoboy
    async function editClient(type, id, name, email) {
        try {
            await fetch(`/api/${type}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email })
            });
            if (type === 'client') {
                loadClients();
            } else {
                loadMotoboys();
            }
        } catch (error) {
            console.error(`Erro ao editar ${type}:`, error);
        }
    }

    // Função para deletar cliente/motoboy
    async function deleteClient(type, id) {
        try {
            await fetch(`/api/${type}/${id}`, {
                method: 'DELETE'
            });
            if (type === 'client') {
                loadClients();
            } else {
                loadMotoboys();
            }
        } catch (error) {
            console.error(`Erro ao excluir ${type}:`, error);
        }
    }

    // Abrir modal de edição
    window.openEditModal = (type, id, name, email) => {
        // Lógica para abrir o modal e preencher os dados
        // Implementar a lógica do modal
    };

    // Atualização em tempo real via WebSocket
    socket.onmessage = function(event) {
        const data = JSON.parse(event.data);
        if (data.type === 'client') {
            loadClients();
        } else if (data.type === 'motoboy') {
            loadMotoboys();
        } else if (data.type === 'stats') {
            loadDashboardStats();
        }
    };

    // Carregar dados ao iniciar
    loadClients();
    loadMotoboys();
    loadDashboardStats();
});
document.addEventListener('DOMContentLoaded', async () => {
    // Inicializa o gráfico de faturamento
    const ctx = document.getElementById('financeGraph').getContext('2d');
    const financeGraph = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [], // As labels serão atualizadas dinamicamente
            datasets: [{
                label: 'Faturamento',
                data: [], // Os dados serão atualizados dinamicamente
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Função para obter dados do backend
    async function fetchData() {
        const response = await fetch('/api/dashboard');
        const data = await response.json();

        // Atualiza o gráfico de faturamento
        financeGraph.data.labels = data.months; // Meses do faturamento
        financeGraph.data.datasets[0].data = data.revenue; // Dados do faturamento
        financeGraph.update();

        // Atualiza total de corridas
        document.getElementById('totalCorridas').textContent = data.totalRides;

        // Atualiza faturamento total
        document.getElementById('faturamento').textContent = `R$ ${data.totalRevenue.toFixed(2)}`;

        // Atualiza gastos com motoboys
        document.getElementById('gastosMotoboys').textContent = `R$ ${data.totalMotoboyExpenses.toFixed(2)}`;
    }

    // Função para carregar e atualizar a tabela de clientes
    async function loadClientes() {
        const response = await fetch('/api/clientes');
        const clientes = await response.json();

        const clientesTableBody = document.getElementById('clientesTableBody');
        clientesTableBody.innerHTML = ''; // Limpa a tabela

        clientes.forEach(cliente => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${cliente.id}</td>
                <td>${cliente.nome}</td>
                <td>${cliente.email}</td>
                <td>
                    <button onclick="editCliente(${cliente.id})">Editar</button>
                    <button onclick="deleteCliente(${cliente.id})">Excluir</button>
                </td>
            `;
            clientesTableBody.appendChild(row);
        });
    }

    // Função para carregar e atualizar a tabela de motoboys
    async function loadMotoboys() {
        const response = await fetch('/api/motoboys');
        const motoboys = await response.json();

        const motoboysTableBody = document.getElementById('motoboysTableBody');
        motoboysTableBody.innerHTML = ''; // Limpa a tabela

        motoboys.forEach(motoboy => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${motoboy.id}</td>
                <td>${motoboy.nome}</td>
                <td>${motoboy.email}</td>
                <td>
                    <button onclick="editMotoboy(${motoboy.id})">Editar</button>
                    <button onclick="deleteMotoboy(${motoboy.id})">Excluir</button>
                </td>
            `;
            motoboysTableBody.appendChild(row);
        });
    }

    // Função para edição de clientes
    window.editCliente = (id) => {
        // Lógica para editar cliente (abrir modal ou redirecionar)
    };

    // Função para exclusão de clientes
    window.deleteCliente = async (id) => {
        await fetch(`/api/clientes/${id}`, { method: 'DELETE' });
        loadClientes(); // Atualiza a tabela após exclusão
    };

    // Função para edição de motoboys
    window.editMotoboy = (id) => {
        // Lógica para editar motoboy (abrir modal ou redirecionar)
    };

    // Função para exclusão de motoboys
    window.deleteMotoboy = async (id) => {
        await fetch(`/api/motoboys/${id}`, { method: 'DELETE' });
        loadMotoboys(); // Atualiza a tabela após exclusão
    };

    // Chamadas iniciais
    await fetchData();
    await loadClientes();
    await loadMotoboys();

    // Atualização em tempo real (usando WebSockets ou setInterval)
    setInterval(async () => {
        await fetchData();
        await loadClientes();
        await loadMotoboys();
    }, 5000); // Atualiza a cada 5 segundos

    // Logout
    document.querySelector('.logout-btn').addEventListener('click', logout);
});

async function logout() {
    await fetch('/api/logout', { method: 'POST' });
    window.location.href = '/login';
}
