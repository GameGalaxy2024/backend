import Order from '../models/order.model.js';
import Product from '../models/product.model.js';

export const createOrder = async (req, res) => {
  const { customerName, customerEmail, shippingAddress, products, orderStatus } = req.body;

  // Asumimos que el ID del usuario está en `req.user._id` después de la autenticación
  const userId = req.body.user;
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Usuario no autenticado.',
    });
  }

  try {
    // Verificamos si los productos existen y si hay suficiente stock
    const productValidationErrors = [];
    const updatedProducts = [];

    for (const orderProduct of products) {
      const { product: productId, quantity } = orderProduct;

      const product = await Product.findById(productId);

      if (!product) {
        productValidationErrors.push(
          `Producto con ID ${productId} no encontrado.`
        );
        continue;
      }

      if (product.stock < quantity) {
        productValidationErrors.push(
          `Stock insuficiente para producto "${product.name}".`
        );
        continue;
      }

      // Resta la cantidad del pedido al stock del producto
      product.stock -= quantity;
      updatedProducts.push(product);
    }

    if (productValidationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        errors: productValidationErrors,
      });
    }

    // Crear la orden incluyendo el ID del usuario y el estado de la orden
    const newOrder = new Order({
      user: userId,
      customerName,
      customerEmail,
      shippingAddress,
      products,
      orderStatus, // Agregamos el estado de la orden
    });

    // Calcular el total de la orden
    newOrder.calculateTotal();

    // Guardar la orden en la base de datos
    await newOrder.save();

    // Guardar los productos actualizados para reflejar el nuevo stock
    for (const product of updatedProducts) {
      await product.save();
    }

    res.status(201).json({
      success: true,
      message: 'Orden creada con éxito.',
      order: newOrder,
    });
  } catch (error) {
    console.error('Error al crear la orden:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor.',
    });
  }
};

export const getOrders = async (req, res) => {
  try {
    // Obtenemos el ID del usuario del parámetro de la ruta
    const userId = req.params.userId;
    // Buscamos todas las órdenes donde el campo `user` coincide con `userId`
    const orders = await Order.find({ user: userId });

    // Verificamos si el usuario tiene órdenes
    if (!orders.length) {
      return res.status(404).json({
        message: 'No se encontraron órdenes para este usuario',
      });
    }

    // Enviamos la lista de órdenes como respuesta
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error al obtener las órdenes del usuario',
    });
  }
};

export const getOrdersAdmin = async (req, res) => {
  try {
    // Buscar todos los productos en la base de datos
    const orders = await Order.find();

    // Enviar respuesta con la lista de productos
    res.status(200).json({
      totalOrders: orders.length,
      orders: orders
    });
  } catch (error) {
    // Manejar errores en caso de falla en la búsqueda de productos
    res.status(500).json({
      message: error.message
    });
  }
};

export const updateOrder = async (req, res) => {
  const { orderId } = req.params;
  const { customerName, customerEmail, shippingAddress, products, orderStatus } = req.body;

  try {
    // Buscar la orden por su ID
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Orden no encontrada.',
      });
    }

    // Verificar si hay cambios en la cantidad de productos
    const productValidationErrors = [];
    const updatedProducts = [];

    for (const orderProduct of products) {
      const { product: productId, quantity } = orderProduct;

      const existingProduct = order.products.find(p => p.product.equals(productId));

      if (!existingProduct) {
        // Si se agrega un nuevo producto, verificar si el stock solicitado existe
        const product = await Product.findById(productId);

        if (!product) {
          productValidationErrors.push(
            `Producto con ID ${productId} no encontrado.`
          );
          continue;
        }

        if (product.stock < quantity) {
          productValidationErrors.push(
            `Stock insuficiente para producto "${product.name}".`
          );
          continue;
        }

        // Restar la cantidad del nuevo producto al stock del producto
        product.stock -= quantity;
        updatedProducts.push(product);
      } else {
        // Si la cantidad de un producto existente cambia, ajustar el stock
        const difference = quantity - existingProduct.quantity;
        const product = await Product.findById(existingProduct.product);

        if (!product) {
          productValidationErrors.push(
            `Producto con ID ${existingProduct.product} no encontrado.`
          );
          continue;
        }

        if (product.stock < difference) {
          productValidationErrors.push(
            `Stock insuficiente para producto "${product.name}".`
          );
          continue;
        }

        // Ajustar el stock del producto
        product.stock -= difference;
        updatedProducts.push(product);
      }
    }

    if (productValidationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        errors: productValidationErrors,
      });
    }

    // Actualizar los datos de la orden
    order.customerName = customerName || order.customerName;
    order.customerEmail = customerEmail || order.customerEmail;
    order.shippingAddress = shippingAddress || order.shippingAddress;
    order.products = products || order.products;
    order.orderStatus = orderStatus || order.orderStatus;

    // Calcular el total de la orden con los nuevos productos
    order.calculateTotal();

    // Guardar la orden actualizada en la base de datos
    await order.save();

    // Guardar los productos actualizados para reflejar el nuevo stock
    for (const product of updatedProducts) {
      await product.save();
    }

    res.status(200).json({
      success: true,
      message: 'Orden actualizada con éxito.',
      order,
    });
  } catch (error) {
    console.error('Error al actualizar la orden:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor.',
    });
  }
};

export const deleteOrder = async (req, res) => {
  const {orderId} = req.params;
  try {
    // Verificar si el producto existe
    const existentOrder = await Order.findById(orderId);
    if (!existentOrder) {
      return res.json({ success: false, mensaje: 'La orden no fue encontrada.' });
    }
    // Eliminar el producto
    await Order.findByIdAndDelete(orderId)
    return res.status(200).json({
      message: 'Order deleted successfully'
    })
  } catch (error) {
    console.error('Error at delete Order:', error);
    return res.status(403).json({ success: false, mensaje: 'Error at update Order' });
  };
};

// Estas funciones cubren la obtención, creación, actualización y eliminación de ordenes en tu aplicación
