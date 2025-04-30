const User = require('../model/User')
const Upi = require('../model/Upi')
const Transaction = require('../model/Transaction')
const dayjs = require('dayjs')
var QRCode = require('qrcode')

exports.getHomePage = async (req, res) => {
    try {
        const username = req.user.username
        const user = await User.findOne({ username: username })
        const upiUser = await Upi.findOne({ name: user.fullname })
        // const qrData = `http://192.168.29.91:3000/people/payment/${upiUser.id}`
        const host = req.headers.host; // gets host like 'localhost:3000' or 'yourdomain.com'
        const protocol = req.protocol; // gets 'http' or 'https'
        const qrData = `${protocol}://${host}/people/payment/${upiUser.id}`;
        QRCode.toDataURL(qrData, function (err, url) {
            if (err) {
                console.log(err)
            }
            var a = url
            return res.render('user/home', { user, a })
        })

    } catch (error) {
        console.log('error in home page', error)
    }
}

exports.getFormSubmissionPage = async (req, res) => {
    return res.render('user/formSubmission')
}

exports.accountOpeningForm = async (req, res) => {
    try {
        const { fullName, dob, phone, email, gender, accountType, occupation, idProof, address } = req.body
        let user = await User.findOne({ username: req.user.username })
        if (!user) {
            return res.render('user/formSubmission')
        }

        user.fullname = fullName,
            user.dob = dob,
            user.phone = phone,
            user.email = email,
            user.gender = gender,
            user.accountType = accountType,
            user.occupation = occupation,
            user.idProof = idProof,
            user.address = address,
            user.id = Date.now()
        user.applied = true

        await user.save()
        return res.render('user/pending')
    } catch (error) {
        console.log('error in form submition', error)
    }
}

exports.getPendingPage = async (req, res) => {
    return res.render('user/pending')
}

exports.getTransaction = async (req, res) => {
    try {
        const username = req.user.username
        const user = await User.findOne({ username: username })
        const transactions = await Transaction.find({
            $or: [
                { senderAccountNumber: user.accountNumber },
                { recieverAccountNumber: user.accountNumber }
            ]
        })

        const transaction = transactions.map(i => ({
            ...i._doc,
            isSender: i.senderAccountNumber === user.accountNumber
        }))
        return res.render('user/transaction', { user, transaction })
    } catch (error) {
        console.log('error in user details', error)
    }
}

exports.getUpi = async (req, res) => {
    try {
        const username = req.user.username
        const user = await User.findOne({ username: username })
        return res.render('user/upi', { user })
    } catch (error) {
        console.log('error in user details', error)
    }
}

exports.upi = async (req, res) => {
    try {

        const existUpi = await Upi.findOne({ upiId: req.body.upiId + req.body.upiCode })
        if (existUpi) {
            return res.redirect('/upi')
        }
        const username = req.user.username
        const user = await User.findOne({ username: username })
        let upi = {
            upiId: req.body.upiId + req.body.upiCode,
            name: user.fullname,
            accountNumber: user.accountNumber,
            id: Date.now()
        }
        Upi.create(upi)
        return res.redirect('/upi')
    } catch (error) {
        console.log('error in upi', error)
    }
}

exports.getPeople = async (req, res) => {
    try {
        const username = req.user.username
        const user = await User.findOne({ username: username })
        let people = await Upi.find()
        return res.render('user/people', { user, people })
    } catch (error) {
        console.log('error in geting people', error)
    }
}

exports.getPayment = async (req, res) => {
    try {
        const id = req.params.id
        const username = req.user.username
        const user = await User.findOne({ username: username })
        const reciever = await Upi.findOne({ id: id })
        const sender = await Upi.findOne({ name: user.fullname })
        const transaction = await Transaction.find({
            $or: [
                { senderUpi: sender.upiId, recieverUpi: reciever.upiId },
                { senderUpi: reciever.upiId, recieverUpi: sender.upiId }
            ]
        })
        return res.render('user/payment', { user, reciever, transaction })
    } catch (error) {
        console.log(error, 'error in send money')
    }
}

exports.payment = async (req, res) => {
    try {
        const id = req.params.id
        const { amount } = req.body
        if (isNaN(amount) || !amount) {
            return res.status(400).send('please enter a valid amount')
        }
        let money = parseFloat(amount)
        const username = req.user.username
        let sender = await User.findOne({ username: username })
        let senderUpi = await Upi.findOne({ name: sender.fullname })
        let finder = await Upi.findOne({ id: id })
        let reciever = await User.findOne({ accountNumber: finder.accountNumber })

        if (parseFloat(sender.balance) < money) {
            return res.status(400).send('Insufficient balance.');
        }
        sender.balance = (parseFloat(sender.balance) - money)
        reciever.balance = (parseFloat(reciever.balance) + money)

        let transactionsData = {
            senderUpi: senderUpi.upiId,
            recieverUpi: finder.upiId,
            senderAccountNumber: senderUpi.accountNumber,
            recieverAccountNumber: finder.accountNumber,
            amount: money,
            transactionId: Date.now(),
            time: dayjs().format('MM-DD-YYYY HH:mm:ss ')
        }
        await Transaction.create(transactionsData)
        await sender.save()
        await reciever.save()
        return res.redirect('/people/payment/' + id)
    } catch (error) {
        console.log(error, 'error in payment')
    }
}

exports.logout = async (req, res) => {
    return res.clearCookie('userToken').redirect('/login')
}