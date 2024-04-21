import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';

// Middleware para verificar si se requiere autenticación mediante token
export const authRequired = (req, res, next) => {
  const token = req.headers.authorization; // Obtener el token del encabezado Authorization

  // Verificar si el token está presente en el encabezado
  if (!token) {
    // Si no hay token, devolver un error de "No token"
    return res.status(401).json({
      message: 'No token, authorization denied',
    });
  }

  // Verificar la validez del token
  jwt.verify(token, TOKEN_SECRET, (err, decoded) => {
    if (err) {
      // Si hay un error en la verificación del token, devolver un error de "Token inválido"
      return res.status(403).json({
        message: 'Invalid token',
      });
    }

    // Si el token es válido, almacenar la información decodificada en req.decoded y pasar al siguiente middleware
    req.decoded = decoded;
    next();
  });
};

// Este middleware verifica si se proporciona un token de autorización en el encabezado Authorization.
//  Si no se proporciona un token, devuelve un error de "No token, autorización denegada".
//  Si se proporciona un token, verifica su validez utilizando la clave secreta TOKEN_SECRET.
//  Si el token es válido, almacena la información decodificada del token en req.decoded y
//   permite que la solicitud continúe al siguiente middleware. Si el token es inválido, devuelve un error de "Token inválido".
