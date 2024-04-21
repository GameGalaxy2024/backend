import User from '../models/user.model.js';
import { createAccessToken } from '../libs/jwt.js';
import { TOKEN_SECRET } from '../config.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Función para registrar un nuevo usuario
export const register = async (req, res) => {
  const { email, password, username, isAdmin } = req.body; // Asegúrate de enviar el campo isAdmin desde el cliente
  try {

    const userFound = User.findOne({email: email});
    if (!userFound.email === undefined) {
        return res.status(403).json({
          message: 'Correo existente'
        })
    } else {
      // Hash de la contraseña
      const passwordHash = await bcrypt.hash(password, 10);

      // Crear un nuevo usuario con la información proporcionada
      const newUser = new User({
        username,
        email,
        password: passwordHash,
        isAdmin // Agregamos el nuevo campo isAdmin
      });

      // Guardar el nuevo usuario en la base de datos
      const userSaved = await newUser.save();

      // Crear token de acceso para el nuevo usuario
      const token = await createAccessToken({ id: userSaved._id });

      // Devolver respuesta con el usuario y el token
      return res.json({
        message: 'User created successfully',
        token,
        id: userSaved._id,
        email: userSaved.email,
        username: userSaved.username,
        isAdmin: userSaved.isAdmin, // Incluimos el nuevo campo en la respuesta
        createdAt: userSaved.createdAt,
        updatedAt: userSaved.updatedAt,
      });
    }

  } catch (error) {
    // Manejar errores en caso de fallo en el registro
    res.status(500).json({
      message: error.message,
    });
    console.log(error);
  }
};

// Función para iniciar sesión
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Buscar usuario por email
    const userFound = await User.findOne({ email });

    // Si el usuario no existe, devolver un error
    if (!userFound) {
      return res.status(400).json({
        message: 'Usuario no encontrado',
      });
    }

    // Verificar la contraseña
    const isMatch = await bcrypt.compare(password, userFound.password);

    // Si la contraseña es incorrecta, devolver un error
    if (!isMatch) {
      return res.status(400).json({
        message: 'Credenciales incorrectas',
      });
    }

    // Crear token de acceso para el usuario autenticado
    const token = await createAccessToken({ id: userFound._id });

    // Devolver respuesta con el usuario y el token
    res.json({
      message: 'User logged successfully',
      token,
      id: userFound._id,
      email: userFound.email,
      username: userFound.username,
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
      isAdmin: userFound.isAdmin
    });
  } catch (error) {
    // Manejar errores en caso de fallo en el inicio de sesión
    res.status(500).json({
      message: error.message,
    });
    console.log(error);
  }
};

// Función para cerrar sesión
export const logout = async (req, res) => {
  // Obtenemos el token del encabezado de autorización
  const token = req.headers['authorization'];
  // Verificamos si el token existe
  if (!token) {
    return res.status(401).json({ mensaje: 'Acceso denegado. Token no proporcionado.' });
  }

  try {
    // Decodificamos el token para obtener la información del usuario
    const decoded = jwt.verify(token, TOKEN_SECRET);

    // Creamos un nuevo token con una fecha de expiración en el pasado
    const expiredToken = jwt.sign({ id: decoded.id }, TOKEN_SECRET, { expiresIn: 0 });

    // Enviamos el nuevo token al cliente (en este caso, al ser 0, el token expirará inmediatamente)
    res.status(200).json({ mensaje: 'Logout exitoso.'});
  } catch (error) {
    // Manejamos cualquier error que pueda surgir durante el proceso
    console.error('Error al hacer logout:', error);
    res.status(500).json({ mensaje: 'Error al hacer logout.' });
  }
};

// Función para obtener el perfil de un usuario
export const profile = async (req, res) => {
  try {
    // Buscar usuario por ID
    const userFound = await User.findById(req.decoded.id);

    // Si el usuario no existe, devolver un error
    if (!userFound) {
      return res.status(400).json({
        message: "User not found"
      });
    }

    // Devolver información del usuario
    return res.json({
      user: {
        id: userFound._id,
        username: userFound.username,
        email: userFound.email,
        isAdmin: userFound.isAdmin, // Incluir el nuevo campo isAdmin
        createdAt: userFound.createdAt,
        updatedAt: userFound.updatedAt
      }
    });
  } catch (error) {
    // Manejar errores en caso de fallo en la búsqueda del perfil
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
};

// Estas funciones cubren la obtención, creación, inicio de sesión, cancelar la sesión y traer la información de usuarios en tu aplicación
