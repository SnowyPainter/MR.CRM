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

router.get('/add/fields', (req, res) => {
    const fieldText = req.query.field;
    res.db.serialize(() => {
        res.db.insert("ReportFormField", {
            "field":fieldText
        })
        res.db.select("ReportFormField", ["id"], "ORDER BY id DESC LIMIT 1", (err, rows) => {
            if(!err) {
                res.send({
                    id: rows[0].id
                })
            } else {
                res.send({
                    err:err
                })
            }
        })
    })
})
router.get('/delete/fields/:id', (req, res) => {
    const id = req.params.id;
    res.db.delete("ReportFormField", "WHERE id="+id);
    res.send({})
})
router.get('/update/fields/:id', (req, res) => {
    const id = req.params.id;
    const fieldText = req.query.field;
    res.db.update("ReportFormField", {
        "field": fieldText
    }, "WHERE id="+id)
    res.send({})
})

module.exports = router;