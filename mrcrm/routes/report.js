var express = require('express');
var config = require('../config/config')
var router = express.Router();
const jwt = require('jsonwebtoken');
const auth = require('./auth')

router.use('/', auth.authIfNotRedirectLogin);

router.get('/get/fields', (req, res) => {
    res.db.select("ReportFormField", [], "", (err, rows) => {
        res.json({fields:rows});
    })
});

module.exports = router;