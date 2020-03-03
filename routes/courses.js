const {Router} = require('express');
const Course = require('../models/course');
const router = Router();

// Items list
router.get('/', async (req, res) => {
    const courses = await Course.find().lean().populate('userId', 'email name');
    res.render('courses.hbs', {
        title: 'Courses',
        isCourses: true,
        courses: courses
    })
});

// Open item by id
router.get('/:id', async (req, res) => {
    const course = await Course.findById(req.params.id).lean();
    res.render('course', {
        layout: "example",
        title: `Курс ${course.title}`,
        course
    })
});

// Edit item by id
router.get('/:id/edit', async (req, res) => {
    if (!req.query.allow) return res.redirect('/');
    const course = await Course.findById(req.params.id).lean();
    res.render("edit-course", {
        title: `Edit ${course.title}`,
        course
    })
});

// Update item by id
router.post('/edit', async (req, res) => {
    const {id, title, price, url} = req.body;
    await Course.findByIdAndUpdate(id, {title, price, url});
    res.redirect('/courses')
});

// Remove item by id
router.post('/remove', async (req, res) => {
    const {id} = req.body;
    await Course.findByIdAndRemove(id);
    res.redirect('/courses')
});

module.exports = router;
