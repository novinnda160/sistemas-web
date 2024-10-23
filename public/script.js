document.addEventListener('DOMContentLoaded', () => {
    const deliveryForm = document.getElementById('deliveryForm');
    const employeeForm = document.getElementById('employeeForm');
    const clientForm = document.getElementById('clientForm');

    // Enviar informações de entrega
    deliveryForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const pickupAddress = document.getElementById('pickupAddress').value;
        const deliveryAddress = document.getElementById('deliveryAddress').value;
        const totalValue = document.getElementById('totalValue').value;
        const coupon = document.querySelector('.coupon-input').value;

        const response = await fetch('/api/delivery', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pickupAddress, deliveryAddress, totalValue, coupon }),
        });

        const data = await response.json();
        if (data.success) {
            document.getElementById('deliveryInfo').innerText = 'Pedido aceito com sucesso!';
            updateOrderStatus(); // Atualiza a lista de status
        }
    });

    // Enviar informações de funcionário
    employeeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const employeeName = document.getElementById('employeeName').value;
        const employeeEmail = document.getElementById('employeeEmail').value;

        const response = await fetch('/api/employees', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: employeeName, email: employeeEmail }),
        });

        const data = await response.json();
        if (data.success) {
            const li = document.createElement('li');
            li.textContent = `${employeeName} - ${employeeEmail}`;
            document.getElementById('employeeList').appendChild(li);
        }
    });

    // Enviar informações de cliente
    clientForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const clientName = document.getElementById('clientName').value;
        const clientEmail = document.getElementById('clientEmail').value;

        const response = await fetch('/api/clients', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: clientName, email: clientEmail }),
        });

        const data = await response.json();
        if (data.success) {
            const li = document.createElement('li');
            li.textContent = `${clientName} - ${clientEmail}`;
            document.getElementById('clientList').appendChild(li);
        }
    });
});

// Função para emitir boleto
function emitirBoleto() {
    alert("Boleto emitido com sucesso!");
}

// Função para excluir fatura
function deleteInvoice(invoiceId) {
    const row = event.target.closest('tr');
    if (row) {
        row.remove();
        alert("Fatura excluída com sucesso!");
    }
}
