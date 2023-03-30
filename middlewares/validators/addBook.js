const {check, validationResult} = require('express-validator')

const addBookValidator = [
    check('name')
        .notEmpty()
        .withMessage("Book name is requied")
        .isLength({min: 3})
        .withMessage("Book name must have 3 characters")
        .trim(),
    check('description')
        .notEmpty()
        .withMessage("Book description is required")
        .trim(),
    check('time')
        .notEmpty()
        .withMessage('Book finishing time is required')
        .trim(),
    check('chapters')
        .notEmpty()
        .withMessage('Chapter is required')
        .custom((chapters) => {
            return Array.isArray(chapters)
        })
        .withMessage("Chapters should be an array")
]

const addBookValidatorHandler = (req, res, next) => {
    const errors = validationResult(req)
    const mappedErrors = errors.mapped()

    if(Object.keys(mappedErrors).length === 0) {
        return next()
    }

    return res.status(400).json({
        errors: mappedErrors
    })
}


module.exports = {
    addBookValidator,
    addBookValidatorHandler
}