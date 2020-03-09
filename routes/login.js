const { Router } = require('express');
const crypt = require('bcryptjs')
const User = require('../models/user')
const router = Router()


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


router.post('/register', async (req, res) => {
    try {
        const { email, name, password, confirm } = req.body
        const notUniq = await User.findOne({ email })
        if (notUniq) {
            // Если пользователь существует - передаем ошибку
            req.flash('regError', 'Email уже занят')
            res.redirect('/login#register')
        }
        // Crypt password
        const hashPass = await crypt.hash(password, 10)
        const user = new User({ email, name, password: hashPass, cart: { items: [] } })
        await user.save()
        res.redirect('/login')
    } catch (error) {
        console.log(error)
    }
})


router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('login')
    })
})


module.exports = router