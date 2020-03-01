const {Router} = require('express');
const Course = require('../models/course');
const router = Router();


router.get('/', async (req, res) => {
    const courses = await Course.find().lean();
    res.render('courses.hbs', {
        title: 'Courses',
        isCourses: true,
        courses: courses
    })
});

// Открываем по id
router.get('/:id', async (req, res) => {
    const course = await Course.findById(req.params.id).lean();
    res.render('course', {
        layout: "example",
        title: `Курс ${course.title}`,
        course
    })
});

// Редактируем по id
router.get('/:id/edit', async (req, res) => {
    if (!req.query.allow) return res.redirect('/');
    const course = await Course.findById(req.params.id).lean();
    res.render("edit-course", {
        title: `Edit ${course.title}`,
        course
    })
});

// Update item
router.post('/edit', async (req, res) => {
    const {id, title, price, url} = req.body;
    await Course.findByIdAndUpdate(id, {title, price, url});
    res.redirect('/courses')
});


router.post('/remove', async (req, res) => {
    const {id} = req.body;
    await Course.findByIdAndRemove(id);
    res.redirect('/courses')
});

module.exports = router;
