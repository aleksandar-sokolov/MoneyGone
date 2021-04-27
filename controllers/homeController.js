const { Router } = require('express');
const isAuth = require('../middlewares/isAuth');
const productServices = require('../services/productServices');
const userServices = require('../services/userServices');


const router = Router();

router.get('/', (req, res) => {

    if (req.user) {
        res.redirect('/exp')
    } else {
        res.render('home', { title: 'Home' });
    }

});

router.post('/:userId/refill', isAuth, (req, res) => {

    userServices.addMoney(req.params.userId, Number(req.body.refill))
        .then((data) => {
            res.redirect('/exp')
        })
        .catch(err => {
            res.render('ops', { title: 'Problem', error: { message: err.message } })
        })
});

router.get('/:userId/profile', isAuth, (req, res) => {
    userServices.getUserData(req.params.userId)
        .then((userdata) => {
            userdata.count = userdata.expenses.length;
            userdata.sum = userdata.expenses.reduce((acc, curr) => acc += curr.total, 0).toFixed(2);
            userdata.available = (userdata.amount - userdata.sum).toFixed(2);
            res.render('account', { title: 'Account Details', ...userdata });

        })
});

module.exports = router;