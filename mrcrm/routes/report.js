var express = require('express');
var config = require('../config/config')
var router = express.Router();
const jwt = require('jsonwebtoken');
const auth = require('./auth')

router.use('/', auth.authIfNotRedirectLogin);

router.get('/create', (req, res) => {
    if (res.data.manager != 1) res.redirect('/')

    res.render('createForm', {
        data: res.data
    });
})

router.get('/get/quests', (req, res) => {
    if (res.data.manager != 1) res.json({ quests: [] });
    res.db.select("ReportFormQuest", [], "", (err, rows) => {
        //send with id
        res.json({ quests: rows });
    })
})
router.get('/get/fields', (req, res) => {
    if (res.data.manager != 1) res.json({ fields: [] });

    res.db.select("ReportFormField", [], "", (err, rows) => {
        //send with id
        res.json({ fields: rows });
    })
});
router.get('/get/field/:id', (req, res) => {
    const id = req.params.id;
    res.db.select("ReportFormField", ["field"], "WHERE id=" + id, (err, rows) => {
        if (!err) {
            res.send({rows:rows})
        } else {
            res.send({})
        }
    })
});
router.get('/add/quest', (req, res) => {
    const fieldId = req.query.fieldId;
    const type = req.query.type;

    res.db.insert("ReportFormQuest", {
        "fieldId": fieldId,
        "submitType": type,
    })
    res.send({})
})
router.get('/add/fields', (req, res) => {
    const fieldText = req.query.field;
    res.db.serialize(() => {
        res.db.insert("ReportFormField", {
            "field": fieldText
        })
        res.db.select("ReportFormField", ["id"], "ORDER BY id DESC LIMIT 1", (err, rows) => {
            if (!err) {
                res.send({
                    id: rows[0].id
                })
            } else {
                res.send({
                    err: err
                })
            }
        })
    })
})

router.get('/delete/quests/:id', (req, res) => {
    const id = req.params.id;
    res.db.delete("ReportFormQuest", "WHERE id=" + id);
    res.send({})
})
router.get('/delete/fields/:id', (req, res) => {
    const id = req.params.id;
    res.db.delete("ReportFormField", "WHERE id=" + id);
    res.db.select("ReportFormQuest", [], "WHERE id=" + id, (err, rows) => {
        rows.forEach(row => {
            if (row.fieldId == id) {
                res.db.delete("ReportFormQuest", "WHERE id=" + row.id)
            }
        });
    })
    res.send({})
})
router.get('/update/quests/:id', (req, res) => {
    const id = req.params.id;
    const fieldId = req.query.fieldId;
    const submitType = req.query.type;
    res.db.update("ReportFormQuest", {
        "fieldId": fieldId,
        "submitType": submitType
    }, "WHERE id=" + id)
    res.send({})
})
router.get('/update/fields/:id', (req, res) => {
    const id = req.params.id;
    const fieldText = req.query.field;
    res.db.update("ReportFormField", {
        "field": fieldText
    }, "WHERE id=" + id)
    res.send({})
})

module.exports = router;