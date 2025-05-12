const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({

    username: {
        type: String,
    },
    password: {
        type: String,
    },
    fullname: {
        type: String,
    },
    dob: {
        type: String,
    },
    phone: {
        type: String,
    },
    email: {
        type: String,
    },
    gender: {
        type: String,
    },
    accountType: {
        type: String,
    },
    occupation: {
        type: String,
    },
    idProof: {
        type: String,
    },
    address: {
        type: String,
    },
    pin: {
        type: String,
    },
    applied: {
        type: Boolean,
        default: false
    },
    approved: {
        type: Boolean,
        default: false
    },
    rejected: {
        type: Boolean,
        default: false
    },
    id: {
        type: String,
    },
    accountNumber: {
        type: String,
    },
    balance: {
        type: String,
        default: 0,
    }
})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next()

    this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.validatePassword = async function (userPassword) {
    return await bcrypt.compare(userPassword, this.password)
}

module.exports = mongoose.model('User', userSchema)