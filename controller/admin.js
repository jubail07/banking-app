const User = require('../model/User')

exports.getAccountPage = async (req, res) => {
    try {
        const user = await User.find({ approved: true })
        const users = await User.find({ applied: true, approved: false, rejected:false })
        return res.render('admin/account', { user, users })
    } catch (error) {
        console.log('error in admin account page', error)
    }
}

exports.getUserPage = async (req, res) => {
    try {
        const users = await User.find({ applied: true, approved: false, rejected:false })
        return res.render('admin/user', { users })
    } catch (error) {
        console.log('error in admins user page', error)
    }
}

exports.getUserDetails = async (req, res) => {
    try {
        const id = req.params.id
        const userDetails = await User.findOne({ id: id })
        return res.render('admin/userDetails', { userDetails })
    } catch (error) {
        console.log('error in user details', error)
    }
}

exports.accepted = async (req, res) => {
    try {
        const id = req.params.id
        const { accountNumber } = req.body
        const user = await User.findOne({ id: id })
        user.approved = true
        user.accountNumber = accountNumber
        await user.save()
        return res.redirect('/admin/user')
    } catch (error) {
        console.log(error, 'error in accepted')
    }
}

exports.accoutManage = async (req, res) => {
    try {
        const id = req.params.id
        const user = await User.findOne({ id: id })
        return res.render('admin/accountManage', { user })
    } catch (error) {
        console.log('error in account manage', error)
    }
}

exports.deposit = async (req, res) => {
    try {
        const id = req.params.id
        const { deposit } = req.body
        const user = await User.findOne({ id: id })
        let currentBalance = parseFloat(user.balance)
        let depositAmount = parseFloat(deposit)
        let newBalance = parseFloat(currentBalance += depositAmount)
        user.balance = newBalance
        await user.save()
        return res.redirect('/admin/accountmanage/' + id)
    } catch (error) {
        console.log('error in deposit page', error)
    }
}

exports.withdraw = async (req, res) => {
    try {
        const id = req.params.id
        const { withdraw } = req.body
        const user = await User.findOne({ id: id })
        let currentBalance = parseFloat(user.balance)
        let withddrawAmount = parseFloat(withdraw)
        if (withddrawAmount > currentBalance) {
            return res.render('admin/alert', { id })
        }
        let newBalance = parseFloat(currentBalance - withddrawAmount)
        user.balance = newBalance
        await user.save()
        return res.redirect('/admin/accountmanage/' + id)
    } catch (error) {
        console.log('error in withdraw page', error)
    }
}


exports.getRejectPage = async (req, res) => {
    try {
        const users = await User.find({ applied: true, approved: false, rejected:false })
        const user = await User.find({ rejected: true })
        return res.render('admin/rejected', { user, users })
    } catch (error) {
        console.log('error in get reject')
    }
}

exports.rejected = async(req, res)=>{
    try {
        const user = await User.findOne({id: req.params.id})
        user.rejected = true
        await user.save()
        return res.redirect('/admin/rejected')
    } catch (error) {
        console.log('error in reject', error)
    }
}

exports.logout = async (req, res) => {
    return res.clearCookie('adminToken').redirect('/admin/login')
}