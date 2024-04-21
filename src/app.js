import express from 'express'; // Importa el framework Express
import morgan from 'morgan'; // Importa el middleware Morgan para el registro de solicitudes HTTP
import authRoutes from './routes/auth.routes.js'; // Importa las rutas relacionadas con la autenticación
import productsRoutes from './routes/products.routes.js'; // Importa las rutas relacionadas con los productos
import ordersRoutes from './routes/orders.routes.js'; // Importa las rutas relacionadas con los pedidos
import cors from 'cors';


const app = express(); // Crea una instancia de la aplicación Express
app.use(cors());
// Configuración de middleware
app.use(morgan('dev')); // Utiliza el middleware Morgan para el registro de solicitudes HTTP en modo desarrollo
app.use(express.json()); // Middleware para analizar el cuerpo de las solicitudes con formato JSON

// Define las rutas para cada grupo de operaciones
app.use('/api', authRoutes); // Rutas relacionadas con la autenticación bajo el prefijo '/api'
app.use('/api', productsRoutes); // Rutas relacionadas con los productos bajo el prefijo '/api'
app.use('/api', ordersRoutes); // Rutas relacionadas con los pedidos bajo el prefijo '/api'

export default app; // Exporta la aplicación Express para su uso en otros archivos


// Este código configura una aplicación Express y utiliza los middleware Morgan y express.json().
// Luego, monta las rutas relacionadas con la autenticación, los productos y los pedidos bajo el prefijo /api.
// Si necesitas más aclaraciones o tienes alguna pregunta adicional, no dudes en preguntar.
