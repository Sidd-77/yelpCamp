const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');

router.get('/register',(req,res)=>{
    res.render('users/register');
})

router.post('/register', catchAsync(async (req,res)=>{
    try{
    const {email,username,password} = req.body;
    const user = new User({email,username});
    const registeredUser = await User.register(user,password);
    req.login(registeredUser,(err)=>{
        if(err) return next(err);
        req.flash('success','Welcome to YelpCamp');
        res.redirect('/campgrounds');
    })
    }catch(e){
        req.flash("error",e.message);
        res.redirect('/users/register');
    }
}));

router.get('/login', (req, res)=>{
    res.render('users/login');
})

router.post('/login', passport.authenticate('local', {
    failureFlash:true,
    failureRedirect:'/users/login',
}), (req,res)=>{
    req.flash('success',"Welcome Back!!");
    res.redirect('/campgrounds')
})

router.get('/logout', (req, res)=>{
    req.logout((err)=>{
        if(err){
            req.flash('error',err.message);
            return res.redirect('/campgrounds');
        }else{
            req.flash('success',"Logged out");
            return res.redirect('/campgrounds');
        }
    });
})

module.exports = router;