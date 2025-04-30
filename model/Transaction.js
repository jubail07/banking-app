const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
    senderUpi:String,
    recieverUpi:String,
    recieverAccountNumber:String,
    senderAccountNumber:String,
    amount:String,
    transactionId:String,
    time:String,
})

module.exports = mongoose.model('Transaction', transactionSchema)
