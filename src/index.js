import app from './app.js'; // Importa la aplicación Express desde el archivo app.js
import { connectDB } from './db.js'; // Importa la función connectDB desde el archivo db.js

// Conecta a la base de datos
connectDB();

// Inicia el servidor Express
app.listen(3000, () => {
  console.log('Server on port 3000'); // Muestra un mensaje en la consola cuando el servidor se inicia correctamente
});
