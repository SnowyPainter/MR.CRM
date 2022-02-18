var express = require('express');
var config = require('../config/config')
var router = express.Router();
const jwt = require('jsonwebtoken');
const auth = require('./auth')

router.use('/', auth.authIfNotRedirectLogin);

router.get('/create', (req, res) => {
    if(res.data.manager != 1) res.redirect('/')

    res.render('createForm', {
        data: res.data
    });
})

router.get('/get/fields', (req, res) => {
    if(res.data.manager != 1) res.json({fields:[]});

    res.db.select("ReportFormField", [], "", (err, rows) => {
        //send with id
        res.json({ fields: rows });
    })
});

router.get('/set/fields/:text', (req, res) => {
    const fieldText = req.params.text;
    //res.db
})
router.get('/delete/fields/:id', (req, res) => {
    const id = req.params.id;
})
router.get('/update/fields/:id', (req, res) => {
    const id = req.params.id;
})

module.exports = router;