const {Router} = require('express');
const Course = require('../models/course');
const router = Router();

router.get('/', (req, res) => {
    res.render('add.hbs', {
        title: 'Add courses',
        isAdd: true
    })
});
router.post('/', async (req, res) => {
    const {title, price, url} = req.body;
    const course = new Course(title, price, url);
    await course.save();
    res.redirect('/courses')
});

module.exports = router;
