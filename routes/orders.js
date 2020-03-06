const { Router } = require('express')
const Order = require('../models/order')
const router = Router()



router.get('/', async (req, res) => {
    try {
        const orders = await Order.find({ 'user.userId': req.user._id }).populate('user.userId')
        const targetOrder = orders.map(item => {
            return {
                ...item._doc,
                price: item.courses.reduce((acc, curr) => acc + (curr.count * curr.course.price), 0),
                date: new Date(item.date).toISOString().slice(0, 10)
            }
        })

        res.render('orders', {
            title: "Оформить заказ",
            isOrders: true,
            orders: targetOrder,
        })
    } catch (error) {
        console.log(error)
    }
})


router.post('/', async (req, res) => {
    try {
        const user = await req.user.populate('cart.items.courseId').execPopulate()
        const courses = user.cart.items.map(elem => ({
            count: elem.count,
            course: { ...elem.courseId._doc }
        }))

        const order = new Order({
            user: {
                name: req.user.name,
                userId: req.user
            },
            courses: courses
        })

        await order.save()
        await req.user.clearCart()

        res.redirect('/orders')
    } catch (e) {
        console.log(e)
    }
})


module.exports = router


