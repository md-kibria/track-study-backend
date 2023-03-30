const {check, validationResult} = require('express-validator')
const { findByProperty } = require('../../services/user')
const error = require('../../utils/error')

const registerValidator = [
    check('name')
        .notEmpty()
        .withMessage("Name is required")
        .isLength({min: 3})
        .withMessage("Name should be minimum 3 characters")
        .trim(),
    check('email')
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email address")
        .trim()
        .custom(async(value) => {
            try {
                const user = await findByProperty('email', value)
                if(user) {
                    throw error('Email already in use', 400)
                }
            } catch (error) {
                throw error(error.message)
            }
        })
        .withMessage("Email already in use"),
    check('password')
        .notEmpty()
        .withMessage("Password is required")
        .isLength({min: 6})
        .withMessage("Password must have 6 character or more"),
    check('passwordConfirmation')
        .notEmpty()
        .withMessage("Confirmation password is required")
        .custom((value, {req}) => {
            // console.log(value, req.body.password)
            if(value !== req.body.password) {
                throw error('Confirmation password is incorrect')
            } else {
                return true;
            }
        })
        .withMessage("Confirmation password is incorrect")
]

const registerValidatorHandler = (req, res, next) => {
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
    registerValidator,
    registerValidatorHandler
}