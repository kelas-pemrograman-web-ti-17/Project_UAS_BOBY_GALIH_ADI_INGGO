var express = require('express');
var crypto = require('crypto');

var User = require('../model/user')
var Obat = require('../model/obatan')
var Data = require('../model/transaksi')
var Auth_middleware = require('../middlewares/auth')

var router = express.Router();
var secret = 'rahasia'
var session_store

/* GET users listing. */
router.get('/member', Auth_middleware.check_login, Auth_middleware.is_member, function(req, res, next) {
    session_store = req.session

    User.find({}, function(err, user) {
        console.log(user);
        res.render('admin/home', { session_store: session_store, users: user })
    })
});

/* GET users listing. */
router.get('/dataobat', Auth_middleware.check_login, Auth_middleware.is_member, function(req, res, next) {
    session_store = req.session

    Obat.find({}, function(err, obatan) {
        console.log(obatan);
        res.render('admin/obat/table', { session_store: session_store, obatans: obatan })
    }).select('_id kodeobat namaobat jenisobat stockobat harga created_at')
});

/* GET users listing. */
router.get('/datatransaksi', Auth_middleware.check_login, Auth_middleware.is_member, function(req, res, next) {
    session_store = req.session

    Data.find({}, function(err, transaksi) {
        console.log(transaksi);
        res.render('admin/transaksis/table', { session_store: session_store, transaksiss: transaksi })
    }).select('_id kodetransaksi namapembeli qty harga created_at')
});





module.exports = router;
