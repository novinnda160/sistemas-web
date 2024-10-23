// Mock database
let clients = [];
let payments = [];
let nextClientId = 1;
let nextPaymentId = 1;

// Função para listar clientes
function fetchClients() {
    const clientList = document.getElementById('clientList');
    clientList.innerHTML = ''; // Limpa a lista de clientes
    clients.forEach(client => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${client.id}</td>
            <td>${client.name}</td>
            <td>${client.email}</td>
            <td>${client.phone}</td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="deleteClient(${client.id})">Deletar</button>
            </td>
        `;
        clientList.appendChild(row);
    });
}

// Função para criar um novo cliente
document.getElementById('createClient').addEventListener('click', function() {
    const clientData = {
        id: nextClientId++,
        name: document.getElementById('clientName').value,
        email: document.getElementById('clientEmail').value,
        phone: document.getElementById('clientPhone').value
    };

    clients.push(clientData);
    alert('Cliente adicionado com sucesso!');
    fetchClients(); // Atualiza a lista de clientes
    document.getElementById('clientForm').reset(); // Limpa o formulário
});

// Função para deletar um cliente
function deleteClient(clientId) {
    if (confirm('Tem certeza que deseja deletar este cliente?')) {
        clients = clients.filter(client => client.id !== clientId);
        alert('Cliente deletado com sucesso!');
        fetchClients(); // Atualiza a lista de clientes
    }
}

// Função para listar pagamentos
function fetchPayments() {
    const paymentHistory = document.getElementById('paymentHistory');
    paymentHistory.innerHTML = ''; // Limpa o histórico de pagamentos
    payments.forEach(payment => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${payment.invoiceId}</td>
            <td>${payment.clientId}</td>
            <td>${payment.amount}</td>
            <td>${payment.status}</td>
            <td>
                <button class="btn btn-success btn-sm" onclick="markAsPaid(${payment.invoiceId})">Marcar como Pago</button>
            </td>
        `;
        paymentHistory.appendChild(row);
    });
}

// Função para criar uma fatura de pagamento
document.getElementById('createInvoice').addEventListener('click', function() {
    const invoiceData = {
        invoiceId: nextPaymentId++,
        clientId: document.getElementById('clientId').value,
        amount: document.getElementById('deliveryValue').value,
        status: 'Pendente'
    };

    payments.push(invoiceData);
    alert('Fatura criada com sucesso!');
    fetchPayments(); // Atualiza o histórico de pagamentos
    document.getElementById('paymentForm').reset(); // Limpa o formulário
});

// Função para marcar uma fatura como paga
function markAsPaid(invoiceId) {
    const payment = payments.find(payment => payment.invoiceId === invoiceId);
    if (payment) {
        payment.status = 'Pago';
        alert('Fatura marcada como paga!');
        fetchPayments(); // Atualiza o histórico de pagamentos
    }
}

// Carregar clientes e pagamentos ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    fetchClients();
    fetchPayments();
});
