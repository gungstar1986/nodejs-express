const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const exphbs = require('express-handlebars');
const app = express();

// Connect .hbs files (routes)
const homeRoutes = require('./routes/home');
const addRoutes = require('./routes/add');
const cardRoutes = require('./routes/card');
const coursesRoutes = require('./routes/courses');


// Customize "express-handlebar"
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views'); // Folder with .hbs files

app.use(express.static(path.join(__dirname, 'public'))); // Connect user .css file
app.use(express.urlencoded({extended: false})); // URL encoded


// Use routes {home, add, courses, card}
app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', coursesRoutes);
app.use('/card', cardRoutes);


// MongoDB connection
async function dbConnect() {
    try {
        const mongoURL = "mongodb+srv://user-admin:DoHfH5UFk13F3WEv@cluster0-jgyf1.mongodb.net/mongoDB";
        await mongoose.connect(mongoURL, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

        // Start Server
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (err) {
        console.log(err)
    }
}

dbConnect();





