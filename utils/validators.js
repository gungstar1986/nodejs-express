const { body } = require('express-validator')
const User = require('../models/user')
const bcrypt = require('bcryptjs')

exports.regValidators = [
    body('email').isEmail().withMessage('Введите корректный email')
        .custom(async (value, { req }) => {
            try {
                const notUniq = await User.findOne({ email: value.toLowerCase().trim() })
                if (notUniq) return Promise.reject('Email уже занят')
                return true
            } catch (e) {
                console.log(e)
            }
        }), // toLowerCase() 
    body('password', 'Минимальная длина пароля 6 символов').isLength({ min: 6 }).isAlphanumeric().trim(),
    body('name', 'Минимальная длина имени 2 символа').isLength({ min: 2 }).trim(),
    body('confirm').custom((value, { req }) => {
        if (value === req.body.password) return true
        throw new Error('Пароли не совпадают')
    }).trim()
]

exports.loginValidators = [
    body('email').isEmail().withMessage('Введите корректный email').custom(async (value, { req }) => {
        try {
            const userExists = await User.findOne({ email: value.toLowerCase().trim() })
            if (userExists) return true
            return Promise.reject('Такого пользователя не существует')
        } catch (e) {
            console.log(e)
        }
    }),
    body('password').custom(async (value, { req }) => {
        const { email } = req.body
        const user = await User.findOne({ email: email.toLowerCase().trim() })
        const arePassSame = await bcrypt.compare(value, user.password)
        if (arePassSame) {
            req.session.user = user
            req.session.isAuthenticated = true
            req.session.save(err => {
                if (err) throw err
            })
            return true
        }
        return Promise.reject('Неверный пароль')
    })
]

exports.courseValidators = [
    body('title').isLength({ min: 1 }).withMessage('Минимальная длина названия 1 символ').trim(),
    body('price').isLength({ min: 1 }).withMessage('Поле "Price" не может быть пустым')
        .isNumeric().withMessage('Поле "Price" должно содержать только цифры').trim(),
    body('url').isURL().withMessage('Введите корректный URL')
]