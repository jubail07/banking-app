const express = require('express')
const router = express.Router()

const {getLoginPage, login } = require('../controller/adminPanel')

// router
//     .route('/signup')
//     .get(getSignupPage)
//     .post(signup)

router
    .route('/login')
    .get(getLoginPage)
    .post(login)

module.exports = router