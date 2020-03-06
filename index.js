const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const User = require('./models/user');
const exphbs = require('express-handlebars');
const app = express();

// Connect .hbs files (routes)
const homeRoutes = require('./routes/home');
const addRoutes = require('./routes/add');
const cardRoutes = require('./routes/card');
const coursesRoutes = require('./routes/courses');
const ordersRoute = require('./routes/orders')


// Customize "express-handlebar"
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views'); // Folder with .hbs files

// Use local directory --- optional
app.use(express.static(path.join(__dirname, 'public'))); // Connect user .css file
app.use(express.urlencoded({extended: false})); // URL encoded

// Find at least one active user
app.use(async (req, res, next) => {
    try {
        req.user = await User.findById('5e5d3cbe904c080fdcb9aa46');
        next()
    } catch (e) {
        console.log(e)
    }
});

// Use routes {home, add, courses, card}
app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', coursesRoutes);
app.use('/card', cardRoutes);
app.use('/orders', ordersRoute);


// MongoDB connection
async function dbConnect() {
    try {
        const mongoURL = "mongodb+srv://user-admin:DoHfH5UFk13F3WEv@cluster0-jgyf1.mongodb.net/mongoDB";
        await mongoose.connect(mongoURL, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

        // Проверяем на наличие хотя бы одного юзера
        const candidate = await User.findOne();


        // Если юзера нет => create new User
        if (!candidate) {
            const user = new User({
                name: 'Denis',
                email: 'gungstar1986@gmail.com',
                cart: {items: []}
            });
            await user.save()
        }


        // Start Server
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (err) {
        console.log(err)
    }
}

dbConnect();





