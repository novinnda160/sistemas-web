async function logout() {
    await fetch('/api/logout', { method: 'POST' });
    window.location.href = '/login';
}

async function fetchClientes() {
    const response = await fetch('/api/clientes');
    const clientes = await response.json();
    
    const clientesTableBody = document.getElementById('clientesTableBody');
    clientesTableBody.innerHTML = '';

    clientes.forEach(cliente => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${cliente.id}</td>
            <td>${cliente.nome}</td>
            <td>${cliente.email}</td>
            <td>
                <button onclick="editCliente(${cliente.id})">Editar</button>
                <button onclick="deleteCliente(${cliente.id})">Deletar</button>
            </td>
        `;
        clientesTableBody.appendChild(row);
    });
}

async function addCliente() {
    const nome = document.getElementById('clienteNome').value;
    const email = document.getElementById('clienteEmail').value;

    await fetch('/api/clientes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, email }),
    });
    fetchClientes();
    closeAddClienteModal();
}

function openAddClienteModal() {
    document.getElementById('addClienteModal').style.display = 'block';
}

function closeAddClienteModal() {
    document.getElementById('addClienteModal').style.display = 'none';
}

async function deleteCliente(clienteId) {
    await fetch(`/api/clientes/${clienteId}`, { method: 'DELETE' });
    fetchClientes();
}

async function fetchMotoboys() {
    const response = await fetch('/api/motoboys');
    const motoboys = await response.json();
    
    const motoboysTableBody = document.getElementById('motoboysTableBody');
    motoboysTableBody.innerHTML = '';

    motoboys.forEach(motoboy => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${motoboy.id}</td>
            <td>${motoboy.nome}</td>
            <td>${motoboy.email}</td>
            <td>
                <button onclick="editMotoboy(${motoboy.id})">Editar</button>
                <button onclick="deleteMotoboy(${motoboy.id})">Deletar</button>
            </td>
        `;
        motoboysTableBody.appendChild(row);
    });
}

async function addMotoboy() {
    const nome = document.getElementById('motoboyNome').value;
    const email = document.getElementById('motoboyEmail').value;

    await fetch('/api/motoboys', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, email }),
    });
    fetchMotoboys();
    closeAddMotoboyModal();
}

function openAddMotoboyModal() {
    document.getElementById('addMotoboyModal').style.display = 'block';
}

function closeAddMotoboyModal() {
    document.getElementById('addMotoboyModal').style.display = 'none';
}

async function deleteMotoboy(motoboyId) {
    await fetch(`/api/motoboys/${motoboyId}`, { method: 'DELETE' });
    fetchMotoboys();
}

async function updateDashboard() {
    const response = await fetch('/api/dashboard');
    const data = await response.json();
    
    document.getElementById('totalCorridas').innerText = data.totalCorridas;
    document.getElementById('faturamento').innerText = `R$ ${data.faturamento}`;
    document.getElementById('gastosMotoboys').innerText = `R$ ${data.gastosMotoboys}`;
}

async function updateFinanceiro() {
    const response = await fetch('/api/financeiro');
    const financeiroData = await response.json();
    
    document.getElementById('totalFaturamento').innerText = `R$ ${financeiroData.totalFaturamento}`;
    document.getElementById('totalGastosMotoboys').innerText = `R$ ${financeiroData.totalGastosMotoboys}`;
    document.getElementById('lucroLiquido').innerText = `R$ ${financeiroData.lucroLiquido}`;
    
    const ctx = document.getElementById('financeGraph').getContext('2d');
    const financeGraph = new Chart(ctx, {
        type: 'line',
        data: {
            labels: financeData.labels,
            datasets: [{
                label: 'Faturamento',
                data: financeData.faturamento,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: false
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
}

// Inicialização
fetchClientes();
fetchMotoboys();
updateDashboard();
updateFinanceiro();
