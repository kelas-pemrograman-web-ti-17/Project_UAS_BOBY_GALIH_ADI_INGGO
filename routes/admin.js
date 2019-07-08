var express = require('express');
var crypto = require('crypto')

var User = require('../model/user')
var Obat = require('../model/obatan')
var Data = require('../model/transaksi')
var Auth_middleware = require('../middlewares/auth')

var router = express.Router();
var secret = 'rahasia'
var session_store

/* GET users listing. */
router.get('/admin', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    User.find({}, function(err, user) {
        //console.log(user);
        res.render('admin/home', { session_store: session_store, users: user })
    }).select('username email firstname lastname users createdAt updatedAt')
});

/* GET users listing. */
router.get('/dataobat', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    Obat.find({}, function(err, obatan) {
        //console.log(obatan);
        res.render('admin/obat/table', { session_store: session_store, obatans: obatan })
    }).select('_id kodeobat namaobat jenisobat stockobat harga created_at')
});

/* GET users listing. */
router.get('/inputobat', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session
    res.render('admin/obat/input_data', { session_store: session_store})
});

//input data obatan
router.post('/inputobat', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

        Obat.find({ kodeobat: req.body.kodeobat }, function(err, obatan) {
            if (obatan.length == 0) {
                var dataobat = new Obat({
                    kodeobat: req.body.kodeobat,
                    namaobat: req.body.namaobat,
                    jenisobat: req.body.jenisobat,
                    stockobat: req.body.stockobat,
                    harga: req.body.harga,
                })
                dataobat.save(function(err) {
                    if (err) {
                        console.log(err);
                        req.flash('msg_error', 'Maaf, nampaknya ada masalah di sistem kami')
                        res.redirect('/dataobat')
                    } else {
                        req.flash('msg_info', 'User telah berhasil dibuat')
                        res.redirect('/dataobat')
                    }
                })
            } else {
                req.flash('msg_error', 'Maaf, kode obat sudah ada....')
                res.render('admin/obat/input_data', {
                    session_store: session_store,
                    kodeobat: req.body.kodeobat,
                    namaobat: req.body.namaobat,
                    jenisobat: req.body.jenisobat,
                    stockobat: req.body.stockobat,
                    harga: req.body.harga,
                })
            }
        })
})

//menampilkan data berdasarkan id
router.get('/:id/editobat', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    Obat.findOne({ _id: req.params.id }, function(err, obatan) {
        if (obatan) {
            console.log("obattt"+obatan);
            res.render('admin/obat/edit_data', { session_store: session_store, obatans: obatan })
        } else {
            req.flash('msg_error', 'Maaf, Data tidak ditemukan')
            res.redirect('/dataobat')
        }
    })
})

router.post('/:id/editobat', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

        Obat.findById(req.params.id, function(err, obat) {
            obat.kodeobat = req.body.kodeobat,
            obat.namaobat = req.body.namaobat,
            obat.jenisobat = req.body.jenisobat,
            obat.stockobat = req.body.stockobat,
            obat.harga = req.body.harga;

            obat.save(function(err, user) {
                if (err) {
                    req.flash('msg_error', 'Maaf, sepertinya ada masalah dengan sistem kami...');
                } else {
                    req.flash('msg_info', 'Edit data berhasil!');
                }

                res.redirect('/dataobat');

            });
        });
})

router.post('/:id/delete', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    Obat.findById(req.params.id, function(err, obatan){
        obatan.remove(function(err, obatan){
            if (err)
            {
                req.flash('msg_error', 'Maaf, kayaknya user yang dimaksud sudah tidak ada. Dan kebetulan lagi ada masalah sama sistem kami :D');
            }
            else
            {
                req.flash('msg_info', 'Data obat berhasil dihapus!');
            }
            res.redirect('/dataobat');
        })
    })
})
/* GET users listing. */
router.get('/datatransaksi', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    Data.find({}, function(err, transaksi) {
        //console.log(transaksi);
        res.render('admin/transaksis/tables', { session_store: session_store, transaksiss: transaksi })
    }).select('_id kodetransaksi namapembeli qty harga created_at')
});

/* GET users listing. */
router.get('/inputdata', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session
    res.render('admin/transaksis/input_datas', { session_store: session_store})
});

//input data transaksi
router.post('/inputdata', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    Data.find({ kodetransaksi: req.body.kodetransaksi }, function(err, transaksi) {
        if (transaksi.length == 0) {
            var datatransaksi = new Data({
                kodetransaksi: req.body.kodetransaksi,
                namapembeli: req.body.namapembeli,
                qty: req.body.qty,
                harga: req.body.harga,
            })
            datatransaksi.save(function(err) {
                if (err) {
                    console.log(err);
                    req.flash('msg_error', 'Maaf, nampaknya ada masalah di sistem kami')
                    res.redirect('/datatransaksi')
                } else {
                    req.flash('msg_info', 'User telah berhasil dibuat')
                    res.redirect('/datatransaksi')
                }
            })
        } else {
            req.flash('msg_error', 'Maaf, kode transaksi sudah ada....')
            res.render('admin/transaksis/input_datas', {
                session_store: session_store,
                kodetransaksi: req.body.kodetransaksi,
                namapembeli: req.body.namapembeli,
                qty: req.body.qty,
                harga: req.body.harga,
            })
        }
    })
})

//menampilkan data berdasarkan id
router.get('/:id/editdata', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    Data.findOne({ _id: req.params.id }, function(err, transaksi) {
        if (transaksi) {
            console.log("transaksisss"+transaksi);
            res.render('admin/transaksis/edit_datas', { session_store: session_store, transaksiss: transaksi })
        } else {
            req.flash('msg_error', 'Maaf, Data tidak ditemukan')
            res.redirect('/datatransaksi')
        }
    })
})

router.post('/:id/editdata', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    Data.findById(req.params.id, function(err, transaksis) {
        transaksis.kodetransaksi = req.body.kodetransaksi,
            transaksis.namapembeli = req.body.namapembeli,
            transaksis.qty = req.body.qty,
            transaksis.harga = req.body.harga;

        transaksis.save(function(err, user) {
            if (err) {
                req.flash('msg_error', 'Maaf, sepertinya ada masalah dengan sistem kami...');
            } else {
                req.flash('msg_info', 'Edit data berhasil!');
            }

            res.redirect('/datatransaksi');

        });
    });
})

router.post('/:id/delete', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    Data.findById(req.params.id, function(err, transaksi){
        transaksi.remove(function(err, transaksi){
            if (err)
            {
                req.flash('msg_error', 'Maaf, kayaknya user yang dimaksud sudah tidak ada. Dan kebetulan lagi ada masalah sama sistem kami :D');
            }
            else
            {
                req.flash('msg_info', 'Data transaksi berhasil dihapus!');
            }
            res.redirect('/datatransaksi');
        })
    })
})
module.exports = router;
