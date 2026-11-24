const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
  },
  customer: {
    name: { type: String, required: true },
    email: { type: String, default: '-' },
    phone: { type: String, default: '-' },
    address: { type: String, default: '-' },
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
      },
      name: {
        type: String,
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
    default: 0,
  },
  paymentMethod: {
    type: String,
    default: 'WhatsApp',
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
