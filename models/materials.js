const mongoose=require('mongoose');

const MaterialSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    unit: { type: String, required: true },
    basePrice: { type: Number, required: true },
    stock: { type: Number, required: true },
    priceHistory: [
      {
        version: { type: String, required: true },
        price: { type: Number, required: true },
        date: { type: Date, default: Date.now }
      }
    ]
  }, { timestamps: true });
  
  module.exports = mongoose.model('Material', MaterialSchema);