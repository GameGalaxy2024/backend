import { Router } from 'express';
import { login, logout, register, profile } from '../controllers/auth.controller.js';
import { authRequired } from '../middlewares/validateToken.js';

const router = Router();

// Rutas para el registro, inicio de sesión, cierre de sesión y perfil de usuario
router.post('/register', register); // Ruta para registrar un nuevo usuario
router.post('/login', login); // Ruta para iniciar sesión
router.post('/logout', logout, authRequired); // Ruta para cerrar sesión
router.get('/profile', authRequired, profile); // Ruta para ver el perfil de usuario (requiere autenticación)

export default router;


// Este código define las rutas para registrar un nuevo usuario, iniciar sesión, cerrar sesión y ver el perfil de usuario.
// La ruta /profile está protegida por el middleware authRequired,
// lo que significa que el usuario debe estar autenticado para acceder a ella.
