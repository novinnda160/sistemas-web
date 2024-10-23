let map, marker;
const orderId = 1; // Substitua pelo ID real do pedido
const motoboyId = 123; // Substitua pelo ID real do motoboy

function initMap() {
    const defaultLocation = { lat: -19.9191, lng: -43.9386 }; // Exemplo: Belo Horizonte

    map = new google.maps.Map(document.getElementById('map'), {
        center: defaultLocation,
        zoom: 15,
    });

    marker = new google.maps.Marker({
        position: defaultLocation,
        map: map,
    });

    updateOrderLocation(orderId);
}

function updateOrderLocation(orderId) {
    fetch(`/api/orders/${orderId}/location`)
        .then(response => response.json())
        .then(data => {
            const deliveryLocation = { lat: data.latitude, lng: data.longitude };
            map.setCenter(deliveryLocation);
            marker.setPosition(deliveryLocation);
            document.getElementById('deliveryAddress').innerText = data.address;
        })
        .catch(error => console.error('Erro ao buscar localização:', error));
}

document.getElementById('acceptOrder').addEventListener('click', () => {
    fetch(`/api/motoboy/accept-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, motoboyId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Pedido aceito com sucesso!');
            updateOrderStatus('accepted');
        } else {
            alert('Erro ao aceitar o pedido.');
        }
    })
    .catch(error => console.error('Erro ao aceitar o pedido:', error));
});

document.getElementById('completeOrder').addEventListener('click', () => {
    fetch(`/api/motoboy/complete-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, motoboyId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Pedido finalizado com sucesso!');
            updateOrderStatus('completed');
        } else {
            alert('Erro ao finalizar o pedido.');
        }
    })
    .catch(error => console.error('Erro ao finalizar o pedido:', error));
});

function updateOrderStatus(status) {
    fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log(`Status atualizado para: ${status}`);
        } else {
            console.error('Erro ao atualizar o status.');
        }
    })
    .catch(error => console.error('Erro ao atualizar o status:', error));
}

function updateRideSummary() {
    fetch(`/api/motoboy/${motoboyId}/summary`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('totalRides').innerText = data.totalRides;
            document.getElementById('totalValue').innerText = `R$ ${data.totalValue.toFixed(2)}`;
        })
        .catch(error => console.error('Erro ao buscar resumo de corridas:', error));
}

document.getElementById('viewHistory').addEventListener('click', () => {
    fetch(`/api/motoboy/${motoboyId}/history`)
        .then(response => response.json())
        .then(data => {
            let historyContent = '';
            data.orders.forEach(order => {
                historyContent += `<p>Pedido #${order.id} - ${order.status} - Valor: R$ ${order.value.toFixed(2)}</p>`;
            });
            alert(historyContent);
        })
        .catch(error => console.error('Erro ao carregar histórico:', error));
});

document.addEventListener('DOMContentLoaded', () => {
    updateRideSummary();
});
// script.js

async function fetchOrders() {
    const response = await fetch('http://localhost:3000/api/orders');
    const orders = await response.json();

    const ordersContainer = document.getElementById('ordersContainer');
    ordersContainer.innerHTML = '';

    orders.forEach(order => {
        const orderElement = document.createElement('div');
        orderElement.innerHTML = `
            <p>Endereço de Entrega: ${order.deliveryAddress}</p>
            <p>Valor Total: R$ ${order.totalValue}</p>
            <button class="acceptOrderBtn" data-id="${order.id}">Aceitar Pedido</button>
        `;
        ordersContainer.appendChild(orderElement);
    });
}

document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('acceptOrderBtn')) {
        const orderId = event.target.dataset.id;
        const response = await fetch(`http://localhost:3000/api/orders/${orderId}/accept`, {
            method: 'POST',
        });

        if (response.ok) {
            alert('Pedido aceito!');
            fetchOrders(); // Atualiza a lista de pedidos
        } else {
            alert('Erro ao aceitar o pedido!');
        }
    }
});


// Para obter todos os pedidos
fetch('/api/orders')
    .then(response => response.json())
    .then(data => {
        console.log(data); // Verifique os pedidos e seus IDs
    })
    .catch(error => console.error('Erro ao buscar pedidos:', error));

// Para obter todos os motoboys
fetch('/api/motoboys')
    .then(response => response.json())
    .then(data => {
        console.log(data); // Verifique os motoboys e seus IDs
    })
    .catch(error => console.error('Erro ao buscar motoboys:', error));


// Carregar pedidos ao iniciar a página
fetchOrders();
