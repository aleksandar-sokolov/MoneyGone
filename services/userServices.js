const Product = require('../models/Product');
const User = require('../models/User');


const getUserData = (id) => {
    return User.findById(id).populate('expenses').lean();
};

function addMoney (id, money) {
    return User.findOneAndUpdate({_id :id}, {$inc : {'amount' : money}})
}

// const getById = (id) => {
//     return Product.findById(id).lean();
// };


// function updateOne(productId, productData) {
//     return Cube.updateOne({_id: productId}, productData);
// }

// function deleteOne(productId) {
//     return Cube.deleteOne({_id: productId});
// }


module.exports = {
    getUserData,
    addMoney,
}
