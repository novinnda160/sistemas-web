import jwt from 'jsonwebtoken'; // Certifique-se de que está importando jwt

// Middleware para autenticação de administrador
const AdminAuth = (req, res, next) => {
    const token = req.cookies.token; // Pegando o token do cookie
    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido.' });
    }

    try {
        const usuario = jwt.verify(token, process.env.JWT_SECRET);
        if (usuario.role !== 'admin') {
            return res.status(403).json({ message: 'Acesso negado.' });
        }
        req.user = usuario;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido.' });
    }
};

export default AdminAuth;
