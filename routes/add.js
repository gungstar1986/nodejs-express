const { Router } = require('express');
const Course = require('../models/course');
const auth = require('../middlewares/auth')
const { validationResult } = require('express-validator')
const { courseValidators } = require('../utils/validators')
const router = Router();

router.get('/', auth, (req, res) => {
    res.render('add', {
        title: 'Add courses',
        isAdd: true
    })
});


router.post('/', auth, courseValidators, async (req, res) => {
    try {

        const { title, price, url } = req.body;
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(422).render('add', {
                title: 'Add course',
                isAdd: true,
                err: errors.array()[0].msg,
                data: { title, price, url }
            })
        }

        const course = new Course({
            title,
            price,
            url,
            userId: req.user._id // Взято из req.user (../index.js)
        });
        await course.save();
        res.redirect('/courses')
    } catch (e) {
        console.log(e)
    }
});

module.exports = router;
