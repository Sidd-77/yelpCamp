const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware');
const campgrounds = require('../controllers/campground');
const {storage, cloudinary} = require('../cloudinary/index');
const multer  = require('multer');
const upload = multer({storage});



router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync (campgrounds.create))
    // .post(upload.array('image'),(req,res)=>{
    //     console.log(req.body, req.files);
    //     res.send("lessgo");
    // })

router.get('/new', isLoggedIn, catchAsync(campgrounds.new));

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground,catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync (campgrounds.deleteCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));


module.exports = router;