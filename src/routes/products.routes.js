import { Router } from 'express';
import { createProduct, deleteProduct, getProducts, updateProduct } from '../controllers/products.controller.js';
import { isAdmin } from '../middlewares/isAdmin.js';
import { authRequired } from '../middlewares/validateToken.js';

const router = Router();

// Rutas para operaciones relacionadas con productos
router.get('/products', authRequired, getProducts); // Obtener todos los productos (requiere autenticación y ser administrador)
router.post('/products', authRequired, isAdmin, createProduct); // Crear un nuevo producto (requiere autenticación y ser administrador)
router.put('/products/:id', authRequired, isAdmin, async (req, res) => { // Actualizar un producto (requiere autenticación y ser administrador)
  const { id } = req.params;
  const newProduct = req.body;
  try {
    const result = await updateProduct(id, newProduct, res);
    if (result.success) {
      return res.status(200).json({ mensaje: result.mensaje });
    } else {
      return res.status(404).json({ error: result.mensaje });
    }
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
});
router.delete('/products/:id', authRequired, isAdmin, deleteProduct); // Eliminar un producto (requiere autenticación y ser administrador)

export default router;

// Este código define las rutas para realizar operaciones relacionadas con los ordenes.
// Cada ruta está protegida por el middleware isAdmin,
// que verifica si el usuario es válido, y el middleware authRequired,
// que valida el token de autenticación.
