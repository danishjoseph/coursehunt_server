var express = require("express");
var router = express.Router();
require("../models/index.js");
const auth = require("../middleware/auth");

// var PlatformModel = require("../models/Platform_model.js");
// var CategoryModel = require("../models/Category_model.js");
// var CourseModel = require("../models/Course_model.js");
const multer = require("multer");
const Upvote_model = require("../models/Upvote_model.js");
const Favourite_model = require("../models/Favourite_model.js");

var upload = multer({});

router.post("/interests", [upload.single(), auth], async( req, res ) => {
  const { _id } = req.body
  if(_id != "undefined" && _id != null){
    const CategoryResponse = await CategoryModel.findOne({ _id: _id });
    if(CategoryResponse){
      const Catmaster = CategoryResponse.Catmaster;
      const SearchCategoryResponse = await CategoryModel.find({ Catmaster: Catmaster });
      res.send({ data: SearchCategoryResponse });
    }
    else{
      res.send({ data: [], message: 'no data available' });
    }
  }
  else{
    const SearchCategoryResponse2 = await CategoryModel.find({}).limit(4);
    res.send({ data: SearchCategoryResponse2 });
  }
});

router.get("/menubar", auth, async (req, res) => {
const CatmasterRespone = await Coursemaster_Mod.find({Status: true});
let response = []
for (let catmaster of CatmasterRespone) {
  let innerItemsArray = [];
  const CategoryRespone = await CategoryModel.find({Status: true, Catmaster: catmaster._id});
  for (let cat of CategoryRespone) {
    let innerObj = {
      label: cat.name,
      _id: cat._id,
      icon: 'pi pi-fw pi-folder'
    }
    innerItemsArray.push(innerObj);
  }
  let outerObj = {
    label: catmaster.name,
    // icon: 'pi pi-fw pi-file',
    items: innerItemsArray
  }

  response.push(outerObj);
}

res.send({ data: response });


});
router.get("/platforms", auth, function (req, res) {
  PlatformModel.find({ status: true, featured: true }).then((response) => {
    res.send({ data: response });
  });
});

router.post("/blogs", [upload.single(), auth], async (req, res) => {
  // BlogModel.find({ status: true, featured: true }).then((response) => {
  //   res.send({ data: response });
  // });

  const { _id } = req.body
  if(_id != "undefined" && _id != null){
    const CategoryResponse = await CategoryModel.findOne({ _id: _id });
    if(CategoryResponse){
      const Catmaster = CategoryResponse.Catmaster;
      const SearchBlogResponse = await BlogModel.find({ Catmaster: Catmaster }).limit(3);
      res.send({ data: SearchBlogResponse });
      console.log('finding related');
    }
    else{
      res.send({ data: [], message: 'no data available' });
    }
  }
  else{
    console.log('finding unrelated');

    const SearchBlogResponse2 = await BlogModel.find({}).limit(3);
    res.send({ data: SearchBlogResponse2 });
  }
});

router.get("/getFilters", auth, async (req, res) => {
  let filterResponse = {};

  const levelFilter = await Master_Level_Mod.find({});

  const certFilter = await Master_Cert_Mod.find({});

  const priceFilter = await Master_Price_Mod.find({});

  const courseMasterFilter = await Coursemaster_Mod.find({});

  filterResponse.levels = levelFilter;
  filterResponse.certs = certFilter;
  filterResponse.price = priceFilter;
  filterResponse.trend = courseMasterFilter;
  // console.log(filterResponse)
  res.send({ data: filterResponse });
});

function parseFilters(filterJSON, flag, pointer){
    if (filterJSON[flag]) {
        let levelArray = filterJSON[flag].toString().split(",");
        if(levelArray.length == 1){
            let levelQuery = {[pointer]: levelArray[0]}
            // filterArray.push(levelQuery);
            // console.log(levelArray);
            return levelQuery;
        }
        else{
            let orArray = []
            for (let index = 0; index < levelArray.length; index++) {
                let element = levelArray[index];
                let levelQuery = {[pointer]: element}
                orArray.push(levelQuery);
                
              }
              let orQuery = { $or: orArray}
              console.log(levelArray,'multiple');
              return orQuery
        }
      }
      else{
          return null;
      }
}

router.post("/courses", [upload.single(), auth], async (req, res) => {
  const { courseType, courseFilters, courseCategory, coursePlatform, courseQuery } = req.body;
  const { user_id } = req.user;

  let filterArray = [{ Type: courseType, Status: true}];
  if(courseCategory != 'null'){
    filterArray.push({Category:courseCategory})
  }
  if(courseQuery){
    // filterArray.push( { $text: { $search: courseQuery } })
    filterArray.push( { Name: { $regex: courseQuery } })
  }
  if(coursePlatform != 'null'){
    filterArray.push({Platform:coursePlatform})
  }
  if (courseFilters != undefined) {
    let filterJSON = JSON.parse(courseFilters);
    let levelFilters = parseFilters(filterJSON, 'levels', 'Level')
    if(levelFilters != null){
        filterArray.push(levelFilters)
    }

    let certFilters = parseFilters(filterJSON, 'certs', 'Cert')
    if(certFilters != null){
        filterArray.push(certFilters)
    }

    let priceFilters = parseFilters(filterJSON, 'prices', 'Price')
    if(priceFilters != null){
        filterArray.push(priceFilters)
    }

    let trendsFilters = parseFilters(filterJSON, 'trends', 'Catmaster')
    if(trendsFilters != null){
        filterArray.push(trendsFilters)
    }

  }
  let findQuery = {
    $and: filterArray 
    // [
    //   // { $or: [ { qty: { $lt : 10 } }, { qty : { $gt: 50 } } ] },
    //   // { $or: [ { sale: true }, { price : { $lt : 5 } } ] }
    // ],
  };
  const courseData = await CourseModel.find(findQuery);
  for (let course of courseData) {
    const vote = await UpvoteModel.findOne({
      courseId: course._id,
      createdBy: user_id,
    });

    const fav = await FavModel.findOne({
      courseId: course._id,
      createdBy: user_id,
    });

    const upvotes = await Upvote_model.find({courseId: course._id}).count();
    course.Upvotes = upvotes;
    course.isVoted = vote ? true : false;
    course.isFav = fav ? true : false;
  }

  courseData.sort(function(a, b){
    let ax =  parseInt(a.Upvotes)
    let bx =  parseInt(b.Upvotes)
    if (ax < bx) return 1;
    if (ax > bx) return -1;
    return 0;
  })
  //   courseData.forEach((resElement) => {
  //   });
  res.send({ data: courseData });
});

router.post("/favCourses", [upload.single(), auth], async (req, res) => {
  // const { courseType } = req.body;
  const { user_id } = req.user;

  let favCourseIdArray = [];

  let favCourses = await FavModel.find({createdBy: user_id});

  favCourses.map((value, index)=>{
    favCourseIdArray.push(value.courseId)
  })
  
  let findQuery = {
    _id: { $in: favCourseIdArray }  
  }
  const courseData = await CourseModel.find(findQuery);
  console.log(courseData, favCourseIdArray);
  for (let course of courseData) {
    const vote = await UpvoteModel.findOne({
      courseId: course._id,
      createdBy: user_id,
    });

    const fav = await FavModel.findOne({
      courseId: course._id,
      createdBy: user_id,
    });

    const upvotes = await Upvote_model.find({courseId: course._id}).count();
    course.Upvotes = upvotes;
    course.isVoted = vote ? true : false;
    course.isFav = fav ? true : false;
  }

  courseData.sort(function(a, b){
    let ax =  parseInt(a.Upvotes)
    let bx =  parseInt(b.Upvotes)
    if (ax < bx) return 1;
    if (ax > bx) return -1;
    return 0;
  })

  res.send({ data: courseData });
});

router.post("/upvote", [upload.single(), auth], async (req, res) => {
  let response = {};
  const { courseId } = req.body;
  const { user_id } = req.user;

  var upvote = new Upvote_model({
    createdBy: user_id,
    courseId: courseId,
  });

  const preVotes = await UpvoteModel.findOne({
    createdBy: user_id,
    courseId: courseId
  });


  if(preVotes){
      response.severity = "error";
      response.summary = "Request denied";
      response.detail = "Already voted";
      res.send({ status: 200, toast: response });
  }
  else{    
    upvote.save(function (err, res2) {
      if (err) {
        response.severity = "error";
        response.summary = "Request failed";
        response.detail = "Technical error, please contact support";
        res.send({ status: 200, toast: response });
      } else {
        response.severity = "success";
        response.summary = "Response";
        response.detail = "Voted successfully!";
        res.send({ status: 200, toast: response });
      }
    });
  }
  });

  router.post("/addToFav", [upload.single(), auth], async (req, res) => {
    let response = {};
    const { courseId } = req.body;
    const { user_id } = req.user;
  
    var addToFav = new FavModel({
      createdBy: user_id,
      courseId: courseId,
    });
  
    const preFav = await FavModel.findOne({
      createdBy: user_id,
      courseId: courseId
    });
  
    if(preFav){
        response.severity = "error";
        response.summary = "Request denied";
        response.detail = "Already Added to Fav";
        res.send({ status: 200, toast: response });
    }
    else{    
      addToFav.save(function (err, res2) {
        if (err) {
          response.severity = "error";
          response.summary = "Request failed";
          response.detail = "Technical error, please contact support";
          res.send({ status: 200, toast: response });
        } else {
          response.severity = "success";
          response.summary = "Response";
          response.detail = "Added to favourite successfully!";
          res.send({ status: 200, toast: response });
        }
      });
    }
    });

router.get("/categories", function (req, res) {
  let toastResponse = {};
  CategoryModel.find().then((response) => {
    res.send({ data: response });
  });
});
module.exports = router;
