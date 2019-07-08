const mongoose = require('mongoose');
const transaksiSchema = mongoose.Schema({
    kodetransaksi        : {type: String, unique: true},
    namapembeli 		: String,
    qty 	         : String,
    harga	        : String,
    created_at		: String
});
module.exports = mongoose.model('transaksi', transaksiSchema);