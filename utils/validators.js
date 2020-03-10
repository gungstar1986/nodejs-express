const { body } = require('express-validator')
const User = require('../models/user')

exports.regValidators = [
    body('email').isEmail().withMessage('Введите корректный email')
        .custom(async (value, { req }) => {
            try {
                const notUniq = await User.findOne({ email: value })
                if (notUniq) return Promise.reject('Email уже занят')
                return true
            } catch (e) {
                console.log(e)
            }
        }),
    body('password', 'Минимальная длина пароля 6 символов').isLength({ min: 6 }).isAlphanumeric(),
    body('name', 'Минимальная длина имени 2 символа').isLength({ min: 2 }),
    body('confirm').custom((value, { req }) => {
        if (value === req.body.password) return true
        throw new Error('Пароли не совпадают')
    })
]