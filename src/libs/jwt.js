import  { TOKEN_SECRET } from '../config.js';
import jwt from 'jsonwebtoken';

export function createAccessToken(payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      TOKEN_SECRET,
      {
        expiresIn: "2d"
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject(err); // Agregamos el manejo de error
        } else {
          resolve(token);
        }
      }
    );
  });
}

// Esta función toma un payload, lo firma utilizando la clave secreta TOKEN_SECRET y genera un token JWT con una expiración de 2 días.
//  Si hay algún error durante el proceso de firma, se maneja y se rechaza la promesa con el error.
