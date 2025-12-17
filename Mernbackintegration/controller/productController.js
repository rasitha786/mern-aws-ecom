const productModel =require("../model/Product");

exports.getProduct =async( req,res)=>{
    try {
        const product= await productModel.find();
        res.json(product)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}
exports.postProduct= async(req,res)=>{
    try {
        console.log("Received request body:", req.body);
        
        const { name, description, image, price, category, stock, brand } = req.body;
        
        // Validate required fields
        if (!name || !description || !image || !price) {
            return res.status(400).json({ 
                error: 'Missing required fields', 
                message: 'Name, description, image, and price are required' 
            });
        }
        
        const newProduct = new productModel({ 
            name, 
            description, 
            image, 
            price: parseFloat(price),
            category: category || 'electronics',
            stock: parseInt(stock) || 0,
            brand: brand || 'Generic'
        });
        
        console.log("Attempting to save product:", newProduct);
        const savedProduct = await newProduct.save();
        console.log("Product saved successfully:", savedProduct);
        
        res.status(201).json(savedProduct); 
    } catch (error) {
        console.error("Error in posting product:", error);
        res.status(500).json({ error: 'Server error', message: error.message }); 
    }
}

exports.deleteProduct=async(req,res)=>{
    const id =req.params.id;
    const deleted=await productModel.findByIdAndDelete(id);
    if(!deleted){
        return res.status(404).json({message:"Product not found"})
    }
    res.status(204).json({message:"Record deleted"})
}

exports.updateProduct=async(req,res)=>{
    try {
        const id= req.params.id;
        const {name,description,price,image}=req.body;
    
        const updated=await productModel.findByIdAndUpdate(
            id,{name,description,price,image},{new:true}
        )
        if(!updated)
        {
            return res.status(404).json({message: "Product not found"})
        }
        res.json(updated)
    } catch (error) {
         console.error("error in posting");
    res.status(500).json({ error: 'Server error' }); 
    }
}