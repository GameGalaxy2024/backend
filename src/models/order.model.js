import mongoose from 'mongoose';

// Modelo del pedido
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, // Referencia al modelo de usuario
      ref: 'User', // Relaciona con el modelo "User"
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    customerEmail: {
      type: String,
      required: true,
    },
    shippingAddress: {
      type: String,
      required: true,
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId, // Referencia al modelo de producto
          ref: 'Product', // Relaciona con el modelo "Product"
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1, // Cantidad mínima de un producto en un pedido
        },
        price: {
          type: Number, // Precio del producto al momento del pedido
          required: true,
        },
      },
    ],
    total: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: Number,
      required: true,
      enum: [1, 2, 3, 4], // Valores permitidos para el estado de pedido: 1, 2, 3
      default: 1, // Estado por defecto: creado
    },
  },
  {
    timestamps: true, // Para tener fechas de creación y actualización automáticas
  }
);

// Método para calcular el total del pedido
orderSchema.methods.calculateTotal = function () {
  // Calcula el total del pedido sumando el precio de cada producto por su cantidad
  this.total = this.products.reduce((sum, product) => {
    const productTotal = product.price * product.quantity;
    // Verifica si el productTotal es un número válido
    if (!isNaN(productTotal)) {
      return sum + productTotal;
    } else {
      // Si el productTotal no es un número válido, no lo sumes al total
      console.error(`Precio inválido para el producto: ${product._id}`);
      return sum;
    }
  }, 0);
};

// Exporta el modelo de pedido
export default mongoose.model('Order', orderSchema);

// Este modelo define la estructura de los documentos de pedidos en la base de datos MongoDB.
// Cada pedido tiene un usuario asociado, información del cliente, dirección de envío, fecha de pedido,
// lista de productos con sus cantidades y precios, total del pedido, y estado del pedido.
// Además, se registran automáticamente las fechas de creación y actualización de cada pedido.
