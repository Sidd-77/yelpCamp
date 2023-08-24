if( process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

const express = require("express");
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError");
const {campgroundSchema, reviewSchema} = require('./schemas');
const campgroundRoutes = require('./routes/campground');
const reviewRoutes = require('./routes/review');
const userRoutes = require('./routes/user');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const MongoDBStore = require('connect-mongo');

//'mongodb://127.0.0.1:27017/yelp'
const dbUrl = process.env.DB_URL;
//const dbUrl = 'mongodb://127.0.0.1:27017/yelp';

mongoose.connect(dbUrl,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const db = mongoose.connection;
db.on("error",console.error.bind(console, "connection error"));
db.once("open",()=>{
    console.log("Database connected");
});


app.engine('ejs',ejsMate);
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());
app.use(helmet({contentSecurityPolicy: false}))

const store = MongoDBStore.create({
    mongoUrl:dbUrl,
    touchAfter: 24 * 3600,
})

store.on("error", function(er){
    console.log("Session Store Error",er);
})

const sessionConf = {
    store,
    secret: 'badsecrete',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //secure: true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7,
    }
}
app.use(session(sessionConf));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

//Routes
app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/reviews',reviewRoutes);
app.use('/users',userRoutes);

// app.get('/fakeuser', async(req,res)=>{
//     const user = new User({email: 'sidd@gmail.com', username:'Sidd'});
//     const newUser = await User.register(user,'passwod');
//     console.log(newUser);
//     res.send(newUser);
// })

app.get('/home',(req,res)=>{
    res.render('home');
})


app.all('*',(req,res,next)=>{
    next(new ExpressError('Page Not Found', 404));
})


app.use((err,req,res,next)=>{
    const {statusCode = 500 } = err;
    if(!err.message) err.message = "Something went wrong";
    res.status(statusCode).render('error',{err});
})

const port = process.env.PORT || 3000;

app.listen(port,()=>{
    console.log("Server Port 3000");
})