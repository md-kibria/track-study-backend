const {check, validationResult} = require('express-validator')
const { findByProperty } = require('../../services/user')
const error = require('../../utils/error')
const bcrypt = 
require('bcryptjs')

const loginValidator = [
    check('email')
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage('Invalid email')
        .custom(async (email) => {
            try {
                const user = await findByProperty('email', email);
                if(!user) {
                    throw error('User not found with this email', 400)
                } else {
                    return true;
                }
            } catch (e) {
                throw error(e.message) 
            }
        })
        .withMessage("User not found with this email"),
    check('password')
        .notEmpty()
        .withMessage('Password is required')
        .custom(async (password, {req}) => {
            try {
                const user = await findByProperty('email', req.body.email)
                if(!user) {
                    throw error('User not found with this email', 400)
                } else {
                    const isMatch = await bcrypt.compare(password, user.password);
                    if(!isMatch) {
                        throw error('Password is not matched')
                    } else {
                        return true;
                    }
                }
            } catch (e) {
                throw error(e.message, 400)
            }
        })
        .withMessage("Password is not correct")
]

const loginValidatorHandler = (req, res, next) => {
    const errors = validationResult(req)
    const mappedErrors = errors.mapped()

    if(Object.keys(mappedErrors).length === 0) {
        return next()
    } else {
        res.status(400).json({
            errors: mappedErrors
        })
    }
}

module.exports = {
    loginValidator,
    loginValidatorHandler
}