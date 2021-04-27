const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: /^[a-zA-Z0-9]+$/,
        // minlenght: 5
    },
    password: {
        type: String,
        required: true,
        // minlenght: 5
    },
    amount : {
        type: Number,
        default: 0
    },
    expenses: [{
        type: mongoose.Types.ObjectId,
        ref: 'Product'
    }]
});

module.exports = mongoose.model('User', userSchema);
