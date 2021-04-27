const mongoose = require('mongoose');


const productShema = new mongoose.Schema({
    merchant: {
        type: String,
        required: true,
        // unique: true,
        // lowercase: true,
        // match: /^[a-zA-Z0-9]+$/,
        // // minlenght: 5
    },
    total: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
        minlenght: 3,
        maxlenght: 30
    },
    report: {
        type: Boolean,
        default: false,
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Product', productShema);
