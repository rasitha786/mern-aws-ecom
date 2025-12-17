// Simple in-memory database for testing
let products = [
  {
    _id: "1",
    name: "Sample Product 1",
    description: "This is a sample product for testing",
    price: 99.99,
    image: "https://via.placeholder.com/300",
    category: "electronics",
    stock: 10,
    brand: "Sample Brand"
  },
  {
    _id: "2", 
    name: "Sample Product 2",
    description: "Another sample product",
    price: 149.99,
    image: "https://via.placeholder.com/300",
    category: "clothing",
    stock: 5,
    brand: "Test Brand"
  }
];

let nextId = 3;

exports.getProduct = async (req, res) => {
    try {
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}

exports.postProduct = async (req, res) => {
    const { name, description, image, price, category, stock, brand } = req.body;
    try {
        const newProduct = {
            _id: nextId.toString(),
            name,
            description,
            image,
            price: parseFloat(price),
            category: category || 'electronics',
            stock: parseInt(stock) || 0,
            brand: brand || 'Generic'
        };
        
        products.push(newProduct);
        nextId++;
        
        res.status(201).json(newProduct);
    } catch (error) {
        console.error("Error in posting product:", error);
        res.status(500).json({ error: 'Server error', message: error.message });
    }
}

exports.deleteProduct = async (req, res) => {
    const id = req.params.id;
    const index = products.findIndex(p => p._id === id);
    
    if (index === -1) {
        return res.status(404).json({ message: "Product not found" });
    }
    
    products.splice(index, 1);
    res.status(204).json({ message: "Record deleted" });
}

exports.updateProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const { name, description, price, image, category, stock, brand } = req.body;
        
        const index = products.findIndex(p => p._id === id);
        
        if (index === -1) {
            return res.status(404).json({ message: "Product not found" });
        }
        
        products[index] = {
            ...products[index],
            name: name || products[index].name,
            description: description || products[index].description,
            price: price || products[index].price,
            image: image || products[index].image,
            category: category || products[index].category,
            stock: stock || products[index].stock,
            brand: brand || products[index].brand
        };
        
        res.json(products[index]);
    } catch (error) {
        console.error("Error in updating product:", error);
        res.status(500).json({ error: 'Server error' });
    }
}