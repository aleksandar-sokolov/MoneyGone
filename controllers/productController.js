const { Router } = require('express');
const isAuth = require('../middlewares/isAuth');
const productServices = require('../services/productServices');
const User = require('../models/User');
const userServices = require('../services/userServices');

const router = Router();

router.get('/', isAuth, (req, res) => {
    userServices.getUserData(req.user._id)
        .then(userdata => {
            userdata.expenses.map(x => x.total = x.total.toFixed(2))
            res.render('home', { title: 'Home', ...userdata });
        }).catch(err => {
            console.log(err);
            res.render('home', { title: 'Home' });
        })
})

router.get('/:id/report', isAuth, (req, res) => {
    productServices.getById(req.params.id)
        .then(data => {
            data.total = data.total.toFixed(2)
            res.render('report', { title: 'Report', ...data });
        }).catch(err => {
            res.redirect('/404')
        })
});

router.get('/:id/stop', isAuth, (req, res) => {
    productServices.deleteOne(req.params.id)
        .then(data => {
            res.redirect('/')
        }).catch(err => {
            res.render('report', { title: 'Report', ...data });
        })
});


router.get('/create', isAuth, (req, res) => {
    res.render('create', { title: 'Create' });
});

router.post('/create', isAuth, (req, res) => {

    const expData = { ...req.body };
    if (expData.merchant.length < 4) {
        return res.render('create', { title: 'Create', ...expData, error: { message: 'The merchant should be at least 4 characters long' } });
    };
    if (expData.total < 0 || expData.total == '') {
        return res.render('create', { title: 'Create', ...expData, error: { message: 'The total should be positive number' } });
    };
    if (expData.description < 3 || expData.description > 30) {
        return res.render('create', { title: 'Create', ...expData, error: { message: 'The description should be minimum 3 characters long and 30 characters maximum' } });
    };

    if (expData.category == undefined) {
        return res.render('create', { title: 'Create', ...expData, error: { message: 'The category should one from the given options' } });
    };

    expData.report = !!expData.report;
    expData.owner = req.user._id;

    productServices.create(expData)
        .then(data => {
            // expData = data;
            // console.log(expData);
            return User.findByIdAndUpdate(req.user._id, { "$push": { "expenses": data._id } })
        })
        .then(someting => {
            res.redirect('/exp')
        })
        .catch(err => {
            res.render('ops', { title: 'Problem', error: { message: err.message } })

        })

})






module.exports = router;