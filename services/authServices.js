const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { SECRET, SALT_ROUNDS } = require('../config/config');
const User = require('../models/User');

// let user = new User({ username: 'Gosho', password: '12334' });

// user.save()
//     .then(result => {
//         console.log(result);
//     }).catch(console.log)

const register = async ({ username, password, amount }) => {

    let user = await User.findOne({ username });

    if (user) {
        throw { message: 'User already exist!' };
    };

    return bcrypt.genSalt(SALT_ROUNDS)
        .then(salt => {
            return bcrypt.hash(password, salt);
        })
        .then(hash => {
            return new User({ username, password: hash, amount });
        })
        .then(newUserData => {
            return newUserData.save();
        })
        // .then(data => console.log('-------------------@@@@@@@@@@@@----------', data))
        .catch(err => {
            // TODO:
            // console.log(Object.keys(err.errors));
            throw { message: err._message || 'Problem with creating user' };
        });

};


const login = async ({ username, password }) => {
    let user = await User.findOne({ username });
    if (!user) throw { message: 'User not found' };

    let isMatch = await bcrypt.compare(password, user.password);
    // console.log(isMatch);
    if (!isMatch) throw { message: 'Password does not match' };

    let token = jwt.sign({ _id: user._id, username: user.username }, SECRET);

    return token;
};



module.exports = {
    register,
    login,
};