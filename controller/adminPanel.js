const Admin = require('../model/Admin')
const createJWt = require('../utils/adminJWT')

// exports.getSignupPage = async (req, res) => {
//     return res.render('adminPanel/signup', { msg: '' })
// }

// exports.signup = async (req, res) => {
//     try {
//         let existUser = await Admin.findOne({ username: req.body.username })
//         if (existUser) {
//             return res.render('adminPanel/signup', { msg: 'user already exist' })
//         }
//         let adminDetails = {
//             username: req.body.username,
//             password: req.body.password
//         }
//         await Admin.create(adminDetails)
//         return res.redirect('/login')
//     } catch (error) {
//         console.log('error in admin signup')
//         return res.status(404)
//     }
// }

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