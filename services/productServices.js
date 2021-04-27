const Product = require('../models/Product'); // change path for model 
const User = require('../models/User');


const getAll = () => {
    return Product.find().lean();
};

const getById = (id) => {
    return Product.findById(id).lean();
};

const create = (data) => {
    const newProduct = new Product(data);
    return newProduct.save();
};

const buy = (shoeId, userId) => {

    console.log(shoeId, userId);
    return Product.findById(shoeId)
        .then(shoe => {
            console.log(shoe.buyers);
            shoe.buyers.push(userId);
            shoe.save()
        })
        .then(() => {
            return User.findById(userId)
        }).then(user => {
            user.offersBougth.push(shoeId);
            return user.save()
        })

};

function updateOne(productId, productData) {
    return Product.updateOne({_id: productId}, productData);
}

function deleteOne(productId) {
    return Product.deleteOne({_id: productId});
}


module.exports = {
    getAll,
    getById,
    create,
    buy,
    updateOne,
    deleteOne
}
