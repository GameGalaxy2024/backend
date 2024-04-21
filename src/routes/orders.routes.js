import { Router } from 'express';
import { createOrder, deleteOrder, getOrders, updateOrder, getOrdersAdmin } from '../controllers/orders.controller.js';
import { isAdmin } from '../middlewares/isAdmin.js';
import { isUser } from '../middlewares/isUser.js'; // Importa el middleware para verificar si el usuario es válido
import { authRequired } from '../middlewares/validateToken.js'; // Importa el middleware para validar el token de autenticación

const router = Router();

// Rutas para operaciones relacionadas con pedidos
router.post('/orders', isUser, authRequired, createOrder); // Crea un nuevo pedido (requiere ser usuario y autenticación)
router.get('/orders/:userId', isUser, authRequired, getOrders); // Obtiene los pedidos de un usuario (requiere ser usuario y autenticación)
router.get('/orders', isAdmin, authRequired, getOrdersAdmin); // Obtiene los pedidos de todos los usuarios (requiere ser administrador y autenticación)
router.put('/orders/:orderId',  authRequired, updateOrder); // Actualiza un pedido (requiere ser usuario y autenticación)
router.delete('/orders/:orderId', isUser, authRequired, deleteOrder); // Elimina un pedido (requiere ser usuario y autenticación)

export default router;

// Este código define las rutas para realizar operaciones relacionadas con los pedidos.
// Cada ruta está protegida por el middleware isUser,
// que verifica si el usuario es válido, y el middleware authRequired,
// que valida el token de autenticación.
