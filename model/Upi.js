const mongoose = require('mongoose')

const upiSchema = new mongoose.Schema({
    upiId:String,
    name:String,
    accountNumber:String,
    id:String,
})

module.exports = mongoose.model('Upi', upiSchema)
