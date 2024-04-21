import mongoose from "mongoose";

// Definición del esquema para los usuarios
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true, // El nombre de usuario es obligatorio
    trim: true // Elimina los espacios en blanco al principio y al final del nombre de usuario
  },
  email: {
    type: String,
    required: true, // El correo electrónico es obligatorio
    trim: true, // Elimina los espacios en blanco al principio y al final del correo electrónico
    unique: true // El correo electrónico debe ser único en la base de datos
  },
  password: {
    type: String,
    required: true // La contraseña es obligatoria
  },
  isAdmin: {
    type: Boolean,
    required: true, // La propiedad isAdmin es obligatoria
    default: false // El valor por defecto de isAdmin es false
  }
}, {
  timestamps: true // Se incluyen los timestamps para registrar la fecha de creación y actualización de cada usuario
});

// Exportar el modelo User que utiliza el esquema userSchema
export default mongoose.model('User', userSchema);


// Este modelo define la estructura de los documentos de usuarios en la base de datos MongoDB.
// Cada usuario tiene un nombre de usuario, un correo electrónico,
//  una contraseña y una propiedad isAdmin que indica si el usuario es un administrador o no.
//   Además, se registran automáticamente las fechas de creación y actualización de cada usuario.
