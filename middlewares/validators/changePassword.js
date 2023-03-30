const { check, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs')

const changePasswordValidator = [
    check("currentPassword")
        .notEmpty()
        .withMessage("Please provide your current password")
        .custom(async (currentPassword, { req }) => {
            try {
                const user = req.user;
                const isMatch = await bcrypt.compare(
                    currentPassword,
                    user.password
                );
                if (!isMatch) {
                    throw error("Current password is not matched");
                } else {
                    return true;
                }
            } catch (e) {
                throw error(e.message, 400);
            }
        })
        .withMessage("Current password is not correct"),
    check("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must have 6 character or more"),
    check("passwordConfirmation")
        .notEmpty()
        .withMessage("Confirmation password is required")
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw error("Confirmation password is incorrect");
            } else {
                return true;
            }
        })
        .withMessage("Confirmation password is incorrect"),
];


const changePasswordValidatorHandler = (req, res, next) => {
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
    changePasswordValidator,
    changePasswordValidatorHandler
}