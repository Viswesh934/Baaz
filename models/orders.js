const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  items: [
    {
      materialId: { type: mongoose.Schema.Types.ObjectId, ref: 'Material', required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true } // Calculated price with discounts
    }
  ],
  totalPrice: { type: Number, required: true }, // Sum of all item prices
  status: { 
    type: String, 
    enum: ['Pending', 'Processed', 'Completed', 'Cancelled'], 
    default: 'Pending' 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
