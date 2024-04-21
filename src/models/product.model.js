import mongoose from "mongoose";

// Definición del esquema para los productos
const productSchema = new  mongoose.Schema({
  name: {
    type: String,
    required: true // El nombre del producto es obligatorio
  },
  description: {
    type: String,
    required: true // La descripción del producto es obligatoria
  },
  price: {
    type: Number,
    required: true // El precio del producto es obligatorio
  },
  stock: {
    type: Number,
    required: true // La cantidad en stock del producto es obligatoria
  },
},{
  timestamps:true // Se incluyen los timestamps para registrar la fecha de creación y actualización de cada producto
});

// Exportar el modelo Product que utiliza el esquema productSchema
export default mongoose.model('Product', productSchema);


// Este modelo define la estructura de los documentos de productos en la base de datos MongoDB.
//  Cada producto tiene un nombre, una descripción, un precio y una cantidad en stock. Además,
// se registran automáticamente las fechas de creación y actualización de cada producto.
