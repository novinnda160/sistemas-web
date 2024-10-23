const socket = io();
const form = document.getElementById('novaEntregaForm');
const listaEntregas = document.getElementById('listaEntregas');

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const descricao = document.getElementById('descricao').value;
    const destino = document.getElementById('destino').value;

    const response = await fetch('/api/entregas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ descricao, destino }),
    });

    const novaEntrega = await response.json();
    adicionarEntregaNaLista(novaEntrega);
    form.reset();
});

socket.on('novaEntrega', (entrega) => {
    adicionarEntregaNaLista(entrega);
});

async function carregarEntregas() {
    const response = await fetch('/api/entregas');
    const entregas = await response.json();
    entregas.forEach(adicionarEntregaNaLista);
}

function adicionarEntregaNaLista(entrega) {
    const item = document.createElement('li');
    item.classList.add('list-group-item');
    item.textContent = `ID: ${entrega.id} - ${entrega.descricao} para ${entrega.destino}`;
    listaEntregas.appendChild(item);
}

carregarEntregas();
