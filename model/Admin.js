const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const adminSchema = new mongoose.Schema({
    username: String,
    password: String,
})

adminSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next()

    this.password = await bcrypt.hash(this.password, 10)
})

adminSchema.methods.validatePassword = async function (adminPassword) {
    return await bcrypt.compare(adminPassword, this.password)
}

module.exports = mongoose.model('Admin', adminSchema)