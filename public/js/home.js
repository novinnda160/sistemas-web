// Função para buscar clientes do backend via API
const fetchClientsFromDatabase = async () => {
    try {
        const response = await fetch('/api/clientes');
        if (!response.ok) {
            throw new Error('Erro ao buscar clientes do banco de dados.');
        }
        return await response.json();
    } catch (error) {
        console.error('Erro:', error);
        alert('Falha ao carregar clientes. Por favor, tente novamente.');
        return [];
    }
};

// Função para carregar os clientes na lista de seleção
const loadClients = async () => {
    const clients = await fetchClientsFromDatabase();
    const clientSelect = document.getElementById('clientSelect');
    clientSelect.innerHTML = '<option value="">Escolha um cliente...</option>';
    
    clients.forEach(client => {
        const option = document.createElement('option');
        option.value = client.id;
        option.textContent = client.nome;
        option.dataset.pickup = client.endereco_coleta || '';
        option.dataset.deliveryCost = client.custo_entrega || 0;
        clientSelect.appendChild(option);
    });
};

// Função para calcular o valor do frete com base na distância
const calculateDeliveryCost = (distance) => {
    if (distance <= 5) {
        return 10; // Até 5 km
    } else if (distance > 5 && distance <= 10) {
        return 20; // Entre 5 km e 10 km
    } else {
        return 50; // Acima de 10 km
    }
};

// Função de exemplo para calcular a distância (você deve implementar a lógica real)
const calculateDistance = (pickupAddress, deliveryAddress) => {
    // Lógica real para calcular a distância entre pickupAddress e deliveryAddress.
    return 10; // Exemplo: 10 km (Substituir por lógica real)
};

// Função para atualizar os campos de coleta e valor do frete
const updateDeliveryInfo = () => {
    const clientSelect = document.getElementById('clientSelect');
    const selectedOption = clientSelect.options[clientSelect.selectedIndex];

    if (selectedOption.value) {
        const pickupAddress = selectedOption.dataset.pickup;
        const deliveryAddress = document.getElementById('deliveryAddress').value; // Endereço de entrega

        const deliveryDistance = calculateDistance(pickupAddress, deliveryAddress);
        const deliveryCost = calculateDeliveryCost(deliveryDistance);

        document.getElementById('pickupAddress').value = pickupAddress;
        document.getElementById('deliveryCost').value = `R$ ${deliveryCost.toFixed(2).replace('.', ',')}`;
        updateFinalCost();
    } else {
        document.getElementById('pickupAddress').value = '';
        document.getElementById('deliveryCost').value = 'R$ 0,00';
        document.getElementById('finalCost').value = 'R$ 0,00';
    }
};

// Função para calcular o valor final, aplicando cupom de desconto
const updateFinalCost = () => {
    const deliveryCost = parseFloat(document.getElementById('deliveryCost').value.replace('R$', '').replace(',', '.')) || 0;
    const discountCoupon = document.getElementById('discountCoupon').value.trim();
    let finalCost = deliveryCost;

    if (discountCoupon === 'DESCONTO10') {
        finalCost *= 0.9; // Aplica 10% de desconto
    }

    document.getElementById('finalCost').value = `R$ ${finalCost.toFixed(2).replace('.', ',')}`;
};

// Função para enviar a solicitação de entrega
const submitDeliveryRequest = async (event) => {
    event.preventDefault();

    const clientSelect = document.getElementById('clientSelect');
    const selectedOption = clientSelect.options[clientSelect.selectedIndex];

    if (!selectedOption.value) {
        alert('Selecione um cliente válido.');
        return;
    }

    const deliveryData = {
        cliente_id: selectedOption.value,
        endereco_coleta: document.getElementById('pickupAddress').value,
        endereco_entrega: document.getElementById('deliveryAddress').value,
        valor: parseFloat(document.getElementById('finalCost').value.replace('R$', '').replace(',', '.')) || 0
    };

    try {
        const response = await fetch('/api/solicitar-entrega', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(deliveryData)
        });

        if (!response.ok) {
            throw new Error('Erro ao solicitar entrega.');
        }

        const result = await response.json();
        alert(`Entrega solicitada com sucesso! Código: ${result.id}`);
        window.location.href = 'motoboy.html'; // Redireciona para a página do motoboy
    } catch (error) {
        console.error('Erro:', error);
        alert('Falha ao solicitar entrega. Tente novamente.');
    }
};

// Adicionando ouvintes de eventos
document.addEventListener('DOMContentLoaded', () => {
    loadClients();
    document.getElementById('clientSelect').addEventListener('change', updateDeliveryInfo);
    document.getElementById('discountCoupon').addEventListener('input', updateFinalCost);
});
