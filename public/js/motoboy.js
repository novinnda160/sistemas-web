
let totalEarnings = 0;
let acceptedDeliveriesCount = 0;

// Escuta novas solicitações de entrega via Socket.IO
socket.on('new_delivery_request', (data) => {
    // Atualiza os campos com as informações da entrega
    $('#searchAddress').val(data.endereco_coleta);
    $('#deliveryAddress').val(data.endereco_entrega);
    $('#deliveryFee').val(data.valor);
    
    // Exibe uma notificação
    $('#alertContainer').append(`<div>Nova entrega solicitada! ID: ${data.entrega_id}</div>`);
});

// Aceitar a entrega
$('#acceptDelivery').click(() => {
    const entregaId = $('#searchAddress').val(); // Aqui você pode definir um jeito melhor de identificar a entrega

    // Enviar requisição para o servidor que a entrega foi aceita
    $.ajax({
        url: '/api/aceitar-entrega',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            entrega_id: entregaId,
            motoboy_id: 1 // Aqui você pode pegar o ID do motoboy logado
        }),
        success: (response) => {
            // Atualiza as informações financeiras
            totalEarnings += parseFloat($('#deliveryFee').val().replace(',', '.'));
            acceptedDeliveriesCount++;

            $('#totalEarnings').text(totalEarnings.toFixed(2).replace('.', ','));
            $('#acceptedDeliveries').text(acceptedDeliveriesCount);
            $('#alertContainer').append(`<div>Corrida aceita com sucesso!</div>`);
        },
        error: (error) => {
            $('#alertContainer').append(`<div>Erro ao aceitar corrida: ${error.responseJSON.message}</div>`);
        }
    });
});

// Long Polling para buscar novas entregas pendentes
async function longPolling() {
    const idEntregador = 1; // ID do entregador, pegue isso dinamicamente conforme necessário

    try {
        const response = await fetch(`/api/entregas/long-polling/${idEntregador}`);
        if (response.ok) {
            const entregas = await response.json();
            // Atualiza a interface do usuário com novas entregas
            for (const entrega of entregas) {
                $('#searchAddress').val(entrega.endereco_coleta);
                $('#deliveryAddress').val(entrega.endereco_entrega);
                $('#deliveryFee').val(entrega.valor);
                
                $('#alertContainer').append(`<div>Nova entrega solicitada! ID: ${entrega.entrega_id}</div>`);
            }
        }
    } catch (error) {
        console.error('Erro no long polling:', error);
    } finally {
        // Reinicia o long polling
        longPolling();
    }
}

// Inicia o long polling
longPolling();
// Função para buscar entregas pendentes do backend via API
const fetchPendingDeliveries = async () => {
    try {
        const response = await fetch('/api/entregas-pendentes');
        if (!response.ok) {
            throw new Error('Erro ao buscar entregas pendentes.');
        }
        return await response.json();
    } catch (error) {
        console.error('Erro:', error);
        return [];
    }
};

// Função para atualizar a interface com as entregas pendentes
const updatePendingDeliveries = async () => {
    const pendingDeliveries = await fetchPendingDeliveries();

    // Atualize a interface do motoboy com as entregas
    const deliveryList = document.getElementById('deliveryList');
    deliveryList.innerHTML = ''; // Limpa a lista atual

    pendingDeliveries.forEach(delivery => {
        const deliveryItem = document.createElement('div');
        deliveryItem.textContent = `ID: ${delivery.id}, Coleta: ${delivery.endereco_coleta}, Entrega: ${delivery.endereco_entrega}, Valor: R$ ${delivery.valor}`;
        deliveryList.appendChild(deliveryItem);
    });
};

// Função para iniciar o polling
const startPolling = () => {
    setInterval(updatePendingDeliveries, 5000); // Poll a cada 5 segundos
};

// Inicie o polling quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    startPolling();
});
