const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    orderCode: { type: String, unique: true, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    items: [{
        productId: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        name: { type: String, required: true },
        img: { type: String, required: true },
        total: { type: Number, required: true },
        variant: { type: String, required: false } //for alternatives
    }],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Confirmed', 'Rejected'], default: 'Pending' },
    customerInfo: {
        name: { type: String },
        surname: { type: String },
        phone: { type: String }
    },
    address: {
        type: String,
        required: true
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
})
const Order = new mongoose.model('Order', orderSchema);
module.exports = Order