const Admin = require('../model/Admin')
const createJWt = require('../utils/adminJWT')


exports.getLoginPage = async (req, res) => {
    return res.render('adminPanel/login', { msg: '' })
}

exports.login = async (req, res) => {
    try {
        const admin = await Admin.findOne({ username: req.body.username })
        if (!admin) {
            return res.render('adminPanel/login', { msg: 'invalid username or password' })
        }
        const isMatch = await admin.validatePassword(req.body.password)
        if (!isMatch) {
            return res.render('adminPanel/login', { msg: 'invalid username or password' })
        }
        const token = createJWt(admin)
        return res.cookie('adminToken', token, { httpOnly: true }).redirect('/admin/account')

    } catch (error) {
        console.log('error in admin login', error)
        return res.status(404)
    }
}