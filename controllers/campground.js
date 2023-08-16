const Campground = require("../models/campground");

module.exports.index = async (req,res)=> {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds});
};

module.exports.new = (req,res)=>{
    res.render("campgrounds/new");
};

module.exports.create = async (req,res,next)=>{
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success',"Successfully made a campground");
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req,res,next)=>{
    //populates authors of reviews
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    //console.log(campground);
    if(!campground){
        console.log("in");
        req.flash('error',"Campground not found");
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show',{campground})
};

module.exports.renderEditForm = async (req,res,next)=>{
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit',{campground})
};

module.exports.updateCampground = async(req,res,next)=>{
    const id = req.params.id;
    const campground =await Campground.findByIdAndUpdate(id, {...req.body.campground},{new: true});
    req.flash('success',"Successfully updated a campground");
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async(req,res,next)=>{
    const id = req.params.id;
    await Campground.findByIdAndDelete(id);
    req.flash('success',"Successfully deleted a campground");
    res.redirect(`/campgrounds`);
};