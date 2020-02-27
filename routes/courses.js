const {Router} = require('express');
const Course = require('../models/course');
const router = Router();


router.get('/', async (req, res) => {
    const courses = await Course.getAll();
    res.render('courses.hbs', {
        title: 'Courses',
        isCourses: true,
        courses: courses
    })
});

// Открываем по id
router.get('/:id', async (req, res) => {
    const course = await Course.getOne(req.params.id);
    res.render('course', {
        layout: "example",
        title: `Курс ${course.title}`,
        course
    })
});
// Редактируем удаляем-? по id
router.get('/:id/edit', async (req, res) => {
    const course = await Course.getOne(req.params.id);
    return !req.query.allow
        ? res.redirect('/')
        : res.render("edit-course", {
            title: `Edit ${course.title}`,
            course
        })
});
router.post('/edit', async (req, res) => {
    await Course.update(req.body);
    res.redirect('/courses')
});
router.post('/delete', async (req, res) => {
    await Course.delete(req.body);
    res.redirect('/courses')
});



module.exports = router;
