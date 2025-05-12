const express = require('express')
const router = express.Router()

const { ifUserLoggedin } = require('../middleware/userLoginVerifier')
const { logout, getHomePage, accountOpeningForm, getPendingPage, getFormSubmissionPage, getTransaction, getUpi, upi, getPeople, getPayment, payment, qrPage } = require('../controller/dashboard')

router
    .route('/')
    .get(ifUserLoggedin, getHomePage)

router
    .route('/form')
    .get(ifUserLoggedin, getFormSubmissionPage)
    .post(ifUserLoggedin, accountOpeningForm)

router
    .route('/pending')
    .get(ifUserLoggedin, getPendingPage)

router
    .route('/transaction')
    .get(ifUserLoggedin, getTransaction)

router
    .route('/upi')
    .get(ifUserLoggedin, getUpi)
    .post(ifUserLoggedin, upi)

router
    .route('/people')
    .get(ifUserLoggedin, getPeople)

router
    .route('/people/payment/:id')
    .get(ifUserLoggedin, getPayment)
    .post(ifUserLoggedin, payment)

router
    .route('/logout')
    .get(logout)

module.exports = router