import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';
import User from '../models/user.model.js';

export const isAdmin = async (req, res, next) => {
  const token = req.headers.authorization; // Se obtiene el token desde la cabecera de la petición

  if (!token) {
    return res.status(401).json({
      message: 'Token not provided'
    });
  }

  try {
    const decoded = jwt.verify(token, TOKEN_SECRET); // Decodificamos el token para saber el id del usuario
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    if (!user.isAdmin) {
      return res.status(403).json({
        message: 'Unauthorized, admin access required'
      });
    }

    // Si el usuario es admin, permitir el paso
    req.decoded = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid token'
    });
  }
};

// Esta función verifica si el token proporcionado en el encabezado de autorización es válido y pertenece a un usuario administrador.
//  Si el token no está presente, devuelve un error de "Token no proporcionado".
//  Si el token es inválido o el usuario no es un administrador, devuelve un error correspondiente. Si el usuario
//  es un administrador válido, permite el paso al siguiente middleware o ruta.
