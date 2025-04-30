const JWT = require('jsonwebtoken')

exports.ifAdminLoggedin = async (req, res, next) => {
    const adminToken = req.cookies?.adminToken
    if (adminToken) {
        let decoded = JWT.verify(adminToken, process.env.JWT_SECRET)
        if (decoded) {
            req.user = decoded
            next()
        } else {
            return res.clearCookie('adminToken').render('adminPanel/login', { msg: 'unexpected error' })
        }
    } else {
        return res.redirect('/admin/login')
    }

}