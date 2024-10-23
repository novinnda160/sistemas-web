// backend/controllers/EntregasController.js
import db from '../database/database.js'; // Ajuste o caminho conforme necessário
import pedidos from '../models/pedido.js';
class EntregasController {
    // Método para listar todas as entregas
    static async listar(req, res) {
        try {
            const entregas = await db('entregas'); // Certifique-se de que a tabela exista
            res.json(entregas);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro ao buscar entregas.' });
        }
        
    
    }

    // Outros métodos, como editar e deletar entregas podem ser adicionados aqui
}
    


export default EntregasController;
