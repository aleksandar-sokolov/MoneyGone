const router = require('express').Router();
const authServices = require('../services/authServices');
const { COOKIE_NAME , SECRET} = require('../config/config')
const jwt = require('jsonwebtoken');

const isGuest = require('../middlewares/isGuest');
const isAuth = require('../middlewares/isAuth');

router.get('/login', isGuest, (req, res) => {
    res.render('login', { title: 'Login' });
});

router.post('/login', isGuest, (req, res) => {
    const { username, password } = req.body;

    authServices.login({ username, password })
        .then(token => {
            res.cookie(COOKIE_NAME, token);
            res.redirect('/');
        }).catch(error => {
            res.render('login', { title: 'Login', error });
        })

});

router.get('/register', isGuest, (req, res) => {
    res.render('register', { title: 'Register' });
});

router.post('/register', isGuest, (req, res) => {
    const { username, password, repeatPassword, amount } = req.body;

    if (password !== repeatPassword) {
        return res.render('register', { error: { title: 'Register', message: 'The repeat password should be equal to the password' }, ...req.body });
        // throw {message: 'Password do not match!'}
    };

    const regExp = /^[a-zA-Z0-9]+$/
    if (username.length < 4 || !regExp.test(username)) {
        return res.render('register', { title: 'Register', error: { message: 'username should be at least 4 characters long and should consist only english letters and digits' }, ...req.body });
        // throw {message: 'Password do not match!'}
    };

    if (password.length < 4) {
        return res.render('register', { title: 'Register', error: { message: 'The password should be at least 4 characters long' }, ...req.body });
        // throw {message: 'Password do not match!'}
    };

    if (Number(amount) < 0) {
        return res.render('register', { title: 'Register', error: { message: 'The account amount  should be positive number' }, ...req.body });
        // throw {message: 'Password do not match!'}
    };


    // authServices.register({ username, password, amount })
    //     .then(data => {
    //         // console.log('------------------', data);

    //         res.redirect('/auth/login')
    //     })
    //     .catch(err => {
    //         // console.log('err: I am here --------------' );
    //         console.log(err.message);
    //         res.render('register', { error: { message: err.message } });
    //     })

    authServices.register({ username, password, amount })
        .then(user => {

            let token = jwt.sign({ _id: user._id, username: user.username }, SECRET);
            res.cookie(COOKIE_NAME, token);
            res.redirect('/exp');

        })
        .catch(err => {
            // console.log('err: I am here --------------' );
            console.log(err.message);
            res.render('register', { error: { message: err.message } });
        })

});


router.get('/logout', (req, res) => {
    res.clearCookie(COOKIE_NAME);
    res.redirect('/');
});

module.exports = router;
