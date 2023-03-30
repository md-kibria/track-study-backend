const jwt = require('jsonwebtoken')
const { findByProperty } = require('../services/user')
const error = require('../utils/error')

const auth = async (req, _res, next) => {
    try {
        let token = req.headers.authorization

        if(!token) throw error('Unauthorized', 401)
        
        token = token.split(' ')[1]
        
        const decode = jwt.verify(token, process.env.SECRET_KEY)
        
        const user = await findByProperty('id', decode._id)
        
        if(!user) throw error('Unauthorized', 401)
        
        req.user = user;
        next()
    } catch (e) {
        next(e)
    }
}

module.exports = auth