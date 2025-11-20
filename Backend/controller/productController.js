// controllers/productController.js

const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');
const fs = require('fs'); // For deleting local temp files

const processProductFiles = async (req, res, next) => {
    // 1. Get raw product data (text fields)
    const {
        name, description, shortDesc, price, discount,
        category, subCategory, stock, sku, specs,
        featured
    } = req.body;

    // 2. Handle existing image URLs (for PUT requests only)
    let finalImageUrls = [];
    if (req.method === 'PUT' && req.body.existingImageUrls) {
        // Parse the JSON string array sent from FormData back into a JS array
        try {
            finalImageUrls = JSON.parse(req.body.existingImageUrls);
        } catch (e) {
            return res.status(400).json({ msg: 'Invalid existingImageUrls format.' });
        }
    }

    // 3. Handle NEW file uploads (for POST and PUT requests)
    if (req.files && req.files.images) {
        // Ensure req.files.images is an array, even if only one file was uploaded
        const newImageFiles = Array.isArray(req.files.images)
        ? req.files.images
        : [req.files.images];

        try {
            for (const file of newImageFiles) {
                const result = await cloudinary.uploader.upload(file.tempFilePath, {
                    folder: 'ecommerce_products', // Set your desired folder
                    resource_type: 'image',
                });
                finalImageUrls.push(result.secure_url);

                // Clean up the temporary file (important for server health)
                fs.unlinkSync(file.tempFilePath);
            }
        } catch (error) {
            console.error('Cloudinary Upload Error:', error);
            return res.status(500).json({ msg: 'Image upload failed.', error });
        }
    }

    // 4. Construct the updated/new product object
    const productFields = {
        name, description, shortDesc, price, discount,
        category, subCategory, stock, sku,
        images: finalImageUrls, // The merged array of old kept URLs + new URLs
        featured: featured === 'true', // Convert string back to boolean
    };

    // 5. Handle JSON fields (specs)
    try {
        productFields.specs = JSON.parse(specs || '{}');
    } catch (e) {
        // You might want to handle this error
    }

    // 6. Pass data to the appropriate route handler
    // We attach the processed data to the request object
    req.productData = productFields;
    next();
};


// Create Product Handler (POST /api/admin/products)
const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.productData); // Use processed data
        res.status(201).json({ product });
    } catch (error) {
        // Handle MongoDB validation or other errors
        console.error('Create Product Error:', error);
        res.status(400).json({ msg: 'Product creation failed', error: error.message });
    }
};

// Update Product Handler (PUT /api/admin/products/:id)
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.productData, // Use processed data
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }
        res.status(200).json({ product });
    } catch (error) {
        console.error('Update Product Error:', error);
        res.status(400).json({ msg: 'Product update failed', error: error.message });
    }
};

// ... other export handlers (getProducts, deleteProduct, etc.)



const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        // 1. Delete images from Cloudinary
        if (product.images && product.images.length > 0) {
            for (const url of product.images) {
                // Cloudinary Public ID is everything between 'ecommerce_products/' and the extension
                // Example URL: https://res.cloudinary.com/dxyz/image/upload/v12345/ecommerce_products/unique_id.jpg
                const urlParts = url.split('/');
                const publicIdWithExtension = urlParts[urlParts.length - 1];
                const publicId = `ecommerce_products/${publicIdWithExtension.split('.')[0]}`;

                // Use Cloudinary SDK to delete the asset
                await cloudinary.uploader.destroy(publicId);
            }
        }

        // 2. Delete product from MongoDB
        await product.deleteOne();

        res.status(200).json({ msg: 'Product deleted successfully.' });
    } catch (error) {
        console.error('Delete Product Error:', error);
        res.status(500).json({ msg: 'Server Error during deletion.' });
    }
};

module.exports = {
    processProductFiles,
    createProduct,
    updateProduct,
    deleteProduct
};
