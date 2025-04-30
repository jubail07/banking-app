const express = require('express')
const router = express.Router()

const { getAccountPage, getUserPage, logout, getUserDetails, accepted, accoutManage, deposit, withdraw, getRejectPage, rejected} = require('../controller/admin')
const { ifAdminLoggedin } = require('../middleware/adminLoginVerifier')

// router
//     .route('/')
//     .get(ifAdminLoggedin, getAdminPage)

router
    .route('/account')
    .get(ifAdminLoggedin, getAccountPage)

router
    .route('/user')
    .get(ifAdminLoggedin, getUserPage)

router
    .route('/userdetails/:id')
    .get(ifAdminLoggedin, getUserDetails)

router
    .route('/accepted/:id')
    .post(ifAdminLoggedin, accepted)

router
    .route('/accountmanage/:id')
    .get(ifAdminLoggedin, accoutManage)

router
    .route('/accountmanage/deposit/:id')
    .post(ifAdminLoggedin, deposit)

router
    .route('/accountmanage/withdraw/:id')
    .post(ifAdminLoggedin, withdraw)

router
    .route('/rejected')
    .get(getRejectPage)
router
    .route('/reject/:id')
    .get(rejected)

router
    .route('/logout')
    .get(logout)

module.exports = router