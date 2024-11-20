import mongoose from "mongoose";


const productSchema = new mongoose.Schema({
    url: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    sku: { type: String, required: true },
    gtin: { type: String, required: true },
    priceHistory: [
        {
            price: { type: Number, required: true },
            date: { type: Date, default: Date.now },
        },
    ],
    price: {
        listPrice: { type: Number, required: true },
        salePrice: { type: Number, required: true },
        discountRate: { type: Number, required: true },
        lowestPrice: { type: Number },
        highestPrice: { type: Number },
        averagePrice: { type: Number },
    },
    description: { type: String, required: true },
    availability: { type: Boolean, required: true },
    images: { type: [String], required: true },
    currency: { type: String, required: true },
    ratingValue: { type: Number, required: true },
    ratingCount: { type: Number, required: true },
    brand: { type: String, required: true },
    users: [
        {
            email: { type: String, required: true },
        }, 
    ], default: [],

}, { timestamps: true });


const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;