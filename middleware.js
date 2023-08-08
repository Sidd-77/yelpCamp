const isLoggedIn = (req,res,next)=>{
    //console.log('info : ',req.user);
    if(!req.isAuthenticated()){
        req.flash('error',"You must be logged in");
        return res.redirect('/users/login');
    }
    next();
}

module.exports = isLoggedIn;