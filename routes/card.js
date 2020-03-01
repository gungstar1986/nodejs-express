const {Router} = require('express');
const Card = require('../models/card');
const Course = require('../models/course');
const router = Router();


router.post('/add', async (req, res) => {
    const course = await Course.findById(req.body.id);
    await Card.add(course);
    res.redirect('/card')
});

router.get('/', async (req, res) => {
    const card = await Card.fetch();
    res.render('card', {
        title: 'Корзина',
        isCard: true,
        courses: card.courses,
        coast: card.price
    })
});

router.delete('/remove/:id', async (req, res) => {
    console.log('check');
    const card = await Card.remove(req.params.id);
    res.status(200).json(card)
});

module.exports = router;
