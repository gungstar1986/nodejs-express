const {Router} = require('express');
const Course = require('../models/course');
const router = Router();

router.get('/', (req, res) => {
    res.render('add', {
        title: 'Add courses',
        isAdd: true
    })
});

router.post('/', async (req, res) => {
    try {
        const {title, price, url} = req.body;
        const course = new Course({title, price, url});
        console.log(typeof course)
        await course.save();
        res.redirect('/courses')
    } catch (e) {
        console.log(e)
    }
});

module.exports = router;
