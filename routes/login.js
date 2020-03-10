const { Router } = require('express');
const { validationResult } = require('express-validator')
const nodemailer = require('nodemailer')
const sendgrid = require('nodemailer-sendgrid-transport')
const crypt = require('bcryptjs')
const crypto = require('crypto')
const keys = require('../keys/keys')
const User = require('../models/user')
const resetMail = require('../mail/reset')
const router = Router()
const regMail = require('../mail/registration')
const { regValidators } = require('../utils/validators')


// Autosend mailer
const transporter = nodemailer.createTransport(sendgrid({
    auth: { api_key: keys.SENDGRID_API_KEY }
}))


router.get('/login', (req, res) => {
    res.render('auth/login', {
        title: 'Login',
        isLogin: true,
        regError: req.flash('regError'),
        logError: req.flash('logError')
    })
})


router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body

        const candidate = await User.findOne({ email }) // find an existing user
        if (candidate) {
            // de-crypt & check password 
            const isSame = await crypt.compare(password, candidate.password) // compare passwords if user exist
            if (isSame) {
                req.session.user = candidate
                req.session.isAuthenticated = true
                req.session.save(err => {
                    if (err) throw err
                    res.redirect('/courses')
                })
            }
            else {
                req.flash('logError', 'Проверьте введенные данные')
                res.redirect('/login#login')
            }
        }
        else {
            req.flash('logError', 'Проверьте введенные данные')
            res.redirect('/login#login')
        }
    } catch (error) {
        console.log(error)
    }
})

// => body() - validador from express-validator... IMPORTANT!
router.post('/register', regValidators, async (req, res) => {
    try {
        // Get params from request body (frontend <form/> side)
        const { email, name, password } = req.body

        // Validation request value (Создание валидатора)
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            req.flash('regError', errors.array()[0].msg) // errors.array()[0].msg => сообщение об ошибки из валидатора
            return res.status(422).redirect('/login#register') // redirect to '/register' page
        }

        // Crypt password
        const hashPass = await crypt.hash(password, 10)
        const user = new User({ email, name, password: hashPass, cart: { items: [] } })
        await user.save()
        res.redirect('/login')
        await transporter.sendMail(regMail(email)) // Send registartion mail
    } catch (error) {
        console.log(error)
    }
})


router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('login')
    })
})


router.get('/reset/password/:token', async (req, res) => {
    try {
        if (!req.params.token) return res.redirect('/login')
        const user = await User.findOne({ resetToken: req.params.token, resetTokenExp: { $gt: Date.now() } })
        if (!user) return res.redirect('/login')
        res.render('auth/password', {
            title: 'Recover password',
            error: req.flash('error'),
            userId: user._id.toString(),
            token: req.params.token
        })
    } catch (error) {
        console.log(error)
    }
})


router.post('/password', async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.userId, resetToken: req.body.token, resetTokenExp: { $gt: Date.now() } })
        if (user) {
            user.password = await crypt.hash(req.body.password, 10)
            user.resetToken = undefined
            user.resetTokenExp = undefined
            await user.save()
            res.redirect('/login')
        } else {
            req.flash('logError', 'Время жизни ссылки истекло')
            res.redirect('/login')
        }
    } catch (error) {
        console.log(error)
    }


    res.redirect('/login')
})


router.get('/reset', (req, res) => {
    res.render('auth/reset', {
        title: 'Reset password',
        resetErr: req.flash('resetErr')
    })
})

// =>
router.post('/reset', (req, res) => {
    try {
        crypto.randomBytes(32, async (err, buffer) => {
            if (err) {
                req.flash('resetErr', 'Что-то пошло не так. Попробуйте, пожалуйста, позже')
                return res.redirect('/reset')
            }
            const token = buffer.toString('hex')
            const candidate = await User.findOne({ email: req.body.email })
            if (candidate) {
                candidate.resetToken = token
                candidate.resetTokenExp = Date.now() + 60 * 60 * 1000
                await candidate.save()
                await transporter.sendMail(resetMail(candidate.email, token))
                res.redirect('/login')
            } else {
                req.flash('resetErr', 'Email не существует')
                res.redirect('/reset')
            }
        })
    } catch (error) {
        console.log(error)
    }
})



module.exports = router