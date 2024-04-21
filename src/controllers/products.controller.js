import Product from '../models/product.model.js';

// Función para obtener todos los productos
export const getProducts =  async (req, res) => {
  try {
    // Buscar todos los productos en la base de datos
    const products = await Product.find();

    // Enviar respuesta con la lista de productos
    res.status(200).json({
      totalProducts: products.length,
      products: products
    });
  } catch (error) {
    // Manejar errores en caso de falla en la búsqueda de productos
    res.status(500).json({
      message: error.message
    });
  }
};

// Función para crear un nuevo producto
export const createProduct = async (req, res) => {
  const { name, description, price, stock } = req.body;
  try {
    // Crear un nuevo producto con la información proporcionada
    const newProduct = new Product({
      name,
      description,
      price,
      stock
    });

    // Guardar el nuevo producto en la base de datos
    const productSaved = await newProduct.save();

    // Enviar respuesta con la confirmación de creación del producto
    res.json({
      message: "Product created successfully",
      id: productSaved._id,
      createdAt: productSaved.createdAt
    });
  } catch (error) {
    // Manejar errores en caso de fallo en la creación del producto
    res.status(500).json({
      message: error.message
    });
  }
};

// Función para actualizar un producto
export const updateProduct =  async  (id, newProduct, res) =>  {
  try {
    // Verificar si el producto existe
    const existentProduct = await Product.findById(id);
    if (!existentProduct) {
      return res.json({ success: false, mensaje: 'Producto no encontrado.' });
    }

    // Actualizar el producto con los nuevos datos
    await Product.findByIdAndUpdate(id, newProduct, { new: true });

    // Devolver mensaje de éxito
    return { success: true, mensaje: 'Producto actualizado exitosamente' };
  } catch (error) {
    // Manejar errores en caso de fallo en la actualización del producto
    console.error('Error al actualizar el producto:', error);
    return { success: false, mensaje: 'Error al actualizar el producto' };
  }
};

// Función para eliminar un producto
export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    // Verificar si el producto existe
    const existentProduct = await Product.findById(id);
    if (!existentProduct) {
      return res.json({ success: false, mensaje: 'El producto no fue encontrado.' });
    }
    // Eliminar el producto de la base de datos
    await Product.findByIdAndDelete(id)
    return res.status(200).json({
      message: 'Producto eliminado exitosamente'
    })
  } catch (error) {
    // Manejar errores en caso de fallo en la eliminación del producto
    console.error('Error al eliminar el producto:', error);
    return res.status(403).json({ success: false, mensaje: 'Error al eliminar el producto' });
  };
};


// Estas funciones cubren la obtención, creación, actualización y eliminación de productos en tu aplicación
