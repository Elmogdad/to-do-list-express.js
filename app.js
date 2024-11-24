const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const bodyParser = require('body-parser');
require('dotenv').config();

process.removeAllListeners('warning');

const app = express();

const authRoutes = require('./routes/auth')
const tasksRoutes = require('./routes/tasks')


// Middleware
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(express.static('public'));
app.set('view engine' , 'ejs');
app.set('views' , 'views');
app.use(bodyParser.urlencoded({extended : false}))

const store = new MongoDBStore({
    uri : process.env.MONGODB_URI,
    collection : 'sessions'
})
app.use(session({
    secret: process.env.SESSION_SECRET,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // تنتهي بعد أسبوع
        secure: process.env.NODE_ENV === 'production', // true في بيئة الإنتاج
        httpOnly: true
    },
    store: store,
    resave: false,
    saveUninitialized: false,
    name: 'sessionId'
}));

app.use((req, res, next) => {
    if (!req.session.user) {
      return next();
    }
    User.findById(req.session.user._id)
      .then(user => {
        req.user = user;
        next();
      })
      .catch(err => console.log(err));
  });
  
  app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    next();
  });

 
app.use(authRoutes)
// app.use(tasksRoutes)


// Database Cennection
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log('conected');
    app.listen(process.env.PORT || 3000)
}).catch(err => {
    console.log(err)
});
