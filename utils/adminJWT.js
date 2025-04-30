const JWT = require('jsonwebtoken')

module.exports = (admin)=>{
    return JWT.sign(
        {
            id:admin.id,
            username:admin.username
        },'secret'
    )
}