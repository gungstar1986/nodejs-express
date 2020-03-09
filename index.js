const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const csrf = require('csurf')
const flash = require('connect-flash')
const exphbs = require('express-handlebars');
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const varMiddleware = require('./middlewares/variables')
const userMiddleware = require('./middlewares/user')
const app = express();
const keys = require('./keys/keys')

// Connect .hbs files (routes)
const homeRoutes = require('./routes/home');
const addRoutes = require('./routes/add');
const cardRoutes = require('./routes/card');
const coursesRoutes = require('./routes/courses');
const ordersRoute = require('./routes/orders')
const loginRoute = require('./routes/login')

// Customize MongoDB Store
const store = new MongoStore({
    collection: 'sessions',
    uri: keys.MONGO_URI
})

// Customize "express-handlebar"
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views'); // Folder with .hbs files

// Use user local directory --- optional
app.use(express.static(path.join(__dirname, 'public'))); // Connect user .css file
app.use(express.urlencoded({ extended: false })); // URL encoded

// Customize {express-session}
app.use(session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store
}))

// Connect csurf & connect-flash (after session connection)
app.use(csrf())
app.use(flash())

// Connect user middleware variable
app.use(varMiddleware)
app.use(userMiddleware)

// Use routes {home, add, courses, card}
app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', coursesRoutes);
app.use('/card', cardRoutes);
app.use('/orders', ordersRoute);
app.use('/', loginRoute)

// MongoDB connection
async function dbConnect() {
    try {
        await mongoose.connect(keys.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

        // Start Server
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (err) {
        console.log(err)
    }
}

dbConnect();





