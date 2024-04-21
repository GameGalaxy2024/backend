import mongoose from 'mongoose'; // Importa la biblioteca Mongoose para interactuar con MongoDB

// URI de conexión a la base de datos MongoDB
const uri = "mongodb+srv://cuelloroyoj:jmcr1134@cluster0.yyo6whu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Función asincrónica para conectar a la base de datos
export const connectDB = async () => {
  try {
    // Intenta conectar a la base de datos utilizando la URI especificada
    await mongoose.connect(uri);
    console.log('Database connected'); // Muestra un mensaje en la consola si la conexión es exitosa
  } catch (error) {
    console.log(error); // Maneja cualquier error que ocurra durante la conexión
  }
};
