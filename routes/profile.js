const { Router } = require('express')
const User = require('../models/user')
const router = Router()
const auth = require('../middlewares/auth') // Неавторизованные пользователи не имеют прав доступа

router.get('/', auth, async (req, res) => {
    res.render('profile', {
        title: 'Профиль',
        isProfile: true,
        user: req.user.toObject()
    })
})

router.post('/', auth, async (req, res) => {

    try {
        const user = await User.findOne({ email: req.user.email })
        // Временный объект для измененных данных
        const toChange = { name: req.body.name }

        // Если файл передан в форму, то добавляем поле во временный объект
        if (req.file) {
            toChange.avatarURL = req.file.path
        }

        // Переопределяем поля в user и сохраняем изменения
        Object.assign(user, toChange)
        await user.save()
        res.redirect('/profile')
    } catch (e) {
        console.log(e)
    }
})

module.exports = router