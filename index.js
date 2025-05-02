require('dotenv').config()

const express = require('express')
const app = express()

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(express.static('static'))
app.use(express.json())

var cookieparser = require('cookie-parser')
app.use(cookieparser())

const { connectDB } = require('./config/database')
connectDB()

const abcd = (req, res , next)=>{
    res.set('Cache-Control', 'no-store')
    return next()
}

const authPages = require('./routes/auth')
const userPages = require('./routes/dashboard')
const adminPanel = require('./routes/adminPanel')
const admin = require('./routes/admin')

app.use('/admin', admin, adminPanel)
app.use('/', abcd ,  authPages, userPages)

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log('app started')
})