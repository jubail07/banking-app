const JWT = require('jsonwebtoken')

exports.ifUserLoggedin = async (req, res, next) => {
    const userToken = req.cookies?.userToken
    if (userToken) {
        let decoded = JWT.verify(userToken, process.env.JWT_SECRET)
        if (decoded) {
            req.user = decoded
            next()
        } else {
            return res.clearCookie('userToken').render('user/login', { msg: 'unexpected error' })
        }
    } else {
        return res.redirect('/login')
    }

}