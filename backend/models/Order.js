const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
  },
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1,
      },
      size: {
        type: String,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  shippingCost: {
    type: Number,
    default: 15000,
  },
  paymentMethod: {
    type: String,
    enum: ['DANA', 'OVO', 'GoPay', 'ShopeePay', 'Transfer Bank', 'COD'],
  },
  status: {
    type: String,
    enum: ['Diproses', 'Dikirim', 'Selesai', 'Dibatalkan'],
    default: 'Diproses',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Auto-generate orderId before saving
orderSchema.pre('save', async function (next) {
  if (!this.orderId) {
    const lastOrder = await this.constructor
      .findOne({}, {}, { sort: { createdAt: -1 } });
    let nextNum = 10039;
    if (lastOrder && lastOrder.orderId) {
      const num = parseInt(lastOrder.orderId.replace('#CLD', ''));
      if (!isNaN(num)) {
        nextNum = num + 1;
      }
    }
    this.orderId = `#CLD${nextNum}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
