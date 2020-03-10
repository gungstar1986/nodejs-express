const { Router } = require('express');
const Course = require('../models/course');
const auth = require('../middlewares/auth')
const router = Router();
const notOwner = (courseId, userId) => courseId.toString() !== userId.toString()

// Items list
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find().populate('userId', 'email name');
        res.render('courses.hbs', {
            title: 'Courses',
            isCourses: true,
            userId: req.user ? req.user._id.toString() : null, // Скрываем элементы от чужих аккаунтов по user._id
            courses: courses
        })
    } catch (e) {
        console.log(e)
    }
});

// Open item by id
router.get('/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        res.render('course', {
            layout: "example",
            title: `Курс ${course.title}`,
            course
        })
    } catch (e) {
        console.log(e)
    }
});

// Edit item by id
router.get('/:id/edit', auth, async (req, res) => {
    // Try to edit course
    if (!req.query.allow) return res.redirect('/');
    try {
        const course = await Course.findById(req.params.id);
        // Защита от несанкционированного редактирования путем подмены id курса
        if (notOwner(course.userId, req.user._id)) return res.redirect('/courses') // Если не владелец
        // ==>
        res.render("edit-course", {
            title: `Edit ${course.title}`,
            course
        })
    } catch (error) {
        console.log(error)
    }

});

// Update item by id
router.post('/edit', auth, async (req, res) => {
    const { id, title, price, url } = req.body; // Данные курса
    try {
        // Защита от несанкционированного редактирования путем подмены id курса
        const course = await Course.findById(id)
        if (notOwner(course.userId, req.user._id)) return res.redirect('/courses') // Если не владелец
        //
        // 2 способа cохранить изменения:
        // await Course.findByIdAndUpdate(id, { title, price, url });
        // или:
        Object.assign(course, { title, price, url })
        await course.save()
        res.redirect('/courses')
    } catch (e) {
        console.log(e)
    }
});

// Remove item by id
router.post('/remove', auth, async (req, res) => {
    try {
        const { id } = req.body;
        const course = await Course.findById(id);
        // Защита от несанкционированного редактирования путем подмены id курса
        if (notOwner(course.userId, req.user._id)) return res.redirect('/courses') // Если не владелец
        // ==>
        await Course.findByIdAndRemove(id);
        res.redirect('/courses')
    } catch (e) {
        console.log(e)
    }
});

module.exports = router;
