var express = require("express");
var constants = require("../config/constants.js");
var router = express.Router();
const multer = require("multer");
require("../models/index.js");
require("../middleware/allowedRoutes");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "upload/images/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname); //Appending .jpg
  },
});
var upload = multer({ storage: storage });
const auth = require("../middleware/auth");

router.get("/getMenu", auth, function (req, res) {
  if (req.user) {
    const { role } = req.user;
    let menus;
    menus = allowedMenus[role];
    if (menus) {
      res.status(200).send({ data: menus });
    }
  }
});

const MasterTypes = {
  cert: Master_Cert_Mod,
  price: Master_Price_Mod,
  level: Master_Level_Mod,
  type: Master_Type_Mod,
  catmaster: Coursemaster_Mod,
  role: Master_Role_Mod,
};

router.post(
  "/addCourse",
  [upload.single("coverImg"), auth],
  function (req, res) {
    var response = {};
    let Status;
    const { role, user_id } = req.user;
    if (role === constants.ROLE_SUPER_ADMIN || role === constants.ROLE_EDITOR) {
      Status = true;
    } else {
      Status = false;
    }

    var CourseToSave = new CourseModel({
      Name: req.body.courseName,
      Description: req.body.courseDescription,
      Rating: req.body.courseRating,
      Price: req.body.coursePrice,
      Level: req.body.courseLevel,
      Cert: req.body.courseCert,
      Duration: req.body.courseDuration,
      Category: req.body.courseCategory,
      Platform: req.body.coursePlatform,
      Type: req.body.courseType,
      Catmaster: req.body.coursemaster,
      cover: req.file.filename,
      destination: req.file.destination,
      Status: Status,
      CreatedBy: user_id,
    });

    CourseToSave.save(function (err, course) {
      if (err) {
        response.severity = "error";
        response.summary = "Request failed";
        response.detail = "Technical error, please contact support";
        res.send({ status: 200, toast: response });
      } else {
        response.severity = "success";
        response.summary = "Response";
        response.detail = "Course Record added successfully!";
        res.send({ status: 200, toast: response });
      }
    });
  }
);

router.post("/updatePlatform", [upload.single(), auth], function (req, res) {
  const { _id, name, link, rating, featured } = req.body;
  const { user_id } = req.user;

  let myquery = { _id: _id };

  var newvalues = {
    $set: {
      name: name,
      link: link,
      rating: rating,
      updatedBy: user_id,
      featured: featured,
    },
  };

  PlatformModel.updateOne(myquery, newvalues, function (err, res2) {
    var response = {};
    if (err) {
      response.severity = "error";
      response.summary = "Request failed";
      response.detail = "Technical error, please contact support";
      res.send({ status: 200, toast: response });
    } else {
      response.severity = "success";
      response.summary = "Response";
      response.detail = "Platform Record " + name + " updated successfully!";
      res.send({ status: 200, toast: response });
    }
  });
});

router.post("/updateBlog", [upload.single(), auth], function (req, res) {
  const { _id, name, shortDesc, desc, title, featured } = req.body;
  const { user_id } = req.user;
  let myquery = { _id: _id };

  var newvalues = {
    $set: {
      Name: name,
      ShortDesc: shortDesc,
      Desc: desc,
      Title: title,
      updatedBy: user_id,
      featured: featured 
    },
  };
  BlogModel.updateOne(myquery, newvalues, function (err, res2) {
    var response = {};
    if (err) {
      response.severity = "error";
      response.summary = "Request failed";
      response.detail = "Technical error, please contact support";
      res.send({ status: 200, toast: response });
    } else {
      response.severity = "success";
      response.summary = "Response";
      response.detail = "Blog Record " + name + " updated successfully!";
      res.send({ status: 200, toast: response });
    }
  });
});

router.post("/updateUser", [upload.single(), auth], function (req, res) {
  const { _id, fullname, username, roleId } = req.body;
  const { user_id, role } = req.user;

  if (role != constants.ROLE_SUPER_ADMIN) {
    res.send(403);
  } else {
    let myquery = { _id: _id };

    var newvalues = {
      $set: {
        name: fullname,
        email: username.toLowerCase(),
        role: roleId,
        UpdatedBy: user_id,
      },
    };

    User_Mod.updateOne(myquery, newvalues, function (err, res2) {
      var response = {};
      if (err) {
        response.severity = "error";
        response.summary = "Request failed";
        response.detail = "Technical error, please contact support";
        res.send({ status: 200, toast: response });
      } else {
        response.severity = "success";
        response.summary = "Response";
        response.detail = "User Record updated successfully!";
        res.send({ status: 200, toast: response });
      }
    });
  }
});

router.post("/updateCategory", [upload.single(), auth], function (req, res) {
  const { _id, name, Catmaster } = req.body;
  const { user_id } = req.user;

  let myquery = { _id: _id };

  var newvalues = { $set: { name: name, updatedBy: user_id, Catmaster: Catmaster } };

  CategoryModel.updateOne(myquery, newvalues, function (err, res2) {
    var response = {};
    if (err) {
      response.severity = "error";
      response.summary = "Request failed";
      response.detail = "Technical error, please contact support";
      res.send({ status: 200, toast: response });
    } else {
      response.severity = "success";
      response.summary = "Response";
      response.detail = "Category Record " + name + " updated successfully!";
      res.send({ status: 200, toast: response });
    }
  });
});

router.post("/updateCourse", [upload.single(), auth], function (req, res) {
  const {
    _id,
    Name,
    Category,
    Catmaster,
    Cert,
    Description,
    Duration,
    Level,
    Platform,
    Price,
    Rating,
    Type,
  } = req.body;
  const { user_id } = req.user;

  let myquery = { _id: _id };

  var newvalues = {
    $set: {
      updatedBy: user_id,
      Category: Category,
      Catmaster: Catmaster,
      Cert: Cert,
      Description: Description,
      Duration: Duration,
      Level: Level,
      Name: Name,
      Platform: Platform,
      Price: Price,
      Rating: parseFloat(Rating),
      Type: Type,
    },
  };

  CourseModel.updateOne(myquery, newvalues, function (err, res2) {
    var response = {};
    if (err) {
      response.severity = "error";
      response.summary = "Request failed";
      response.detail = "Technical error, please contact support";
      res.send({ status: 200, toast: response });
    } else {
      response.severity = "success";
      response.summary = "Response";
      response.detail = "Course Record " + " updated successfully!";
      res.send({ status: 200, toast: response });
    }
  });
});

router.post("/deactivateCourse", [upload.single(), auth], function (req, res) {
  const { _id } = req.body;
  const { user_id } = req.user;

  let myquery = { _id: _id };

  var newvalues = {
    $set: {
      Status: false,
      UpdatedBy: user_id,
    },
  };

  CourseModel.updateOne(myquery, newvalues, function (err, res2) {
    var response = {};
    if (err) {
      response.severity = "error";
      response.summary = "Request failed";
      response.detail = "Technical error, please contact support";
      res.send({ status: 200, toast: response });
    } else {
      response.severity = "success";
      response.summary = "Response";
      response.detail = "Course Record deleted successfully!";
      res.send({ status: 200, toast: response });
    }
  });
});

router.post("/activateCourse", [upload.single(), auth], function (req, res) {
  const { _id } = req.body;
  const { user_id, role } = req.user;
  if (role != constants.ROLE_SUPER_ADMIN) {
    res.send(403);
  } else {
    let myquery = { _id: _id };

    var newvalues = {
      $set: {
        Status: true,
        UpdatedBy: user_id,
      },
    };

    CourseModel.updateOne(myquery, newvalues, function (err, res2) {
      var response = {};
      if (err) {
        response.severity = "error";
        response.summary = "Request failed";
        response.detail = "Technical error, please contact support";
        res.send({ status: 200, toast: response });
      } else {
        response.severity = "success";
        response.summary = "Response";
        response.detail = "Course Record deleted successfully!";
        res.send({ status: 200, toast: response });
      }
    });
  }
});

router.post("/deletePlatform", [upload.single(), auth], function (req, res) {
  const { _id } = req.body;
  const { user_id } = req.user;

  let myquery = { _id: _id };

  var newvalues = { $set: { updatedBy: user_id, status: false } };

  PlatformModel.updateOne(myquery, newvalues, function (err, res2) {
    var response = {};
    if (err) {
      response.severity = "error";
      response.summary = "Request failed";
      response.detail = "Technical error, please contact support";
      res.send({ status: 200, toast: response });
    } else {
      response.severity = "success";
      response.summary = "Response";
      response.detail = "Platform Record deleted successfully!";
      res.send({ status: 200, toast: response });
    }
  });
});

router.post("/deleteBlog", [upload.single(), auth], function (req, res) {
  const { _id } = req.body;
  const { user_id } = req.user;

  let myquery = { _id: _id };

  var newvalues = { $set: { updatedBy: user_id, status: false } };

  BlogModel.updateOne(myquery, newvalues, function (err, res2) {
    var response = {};
    if (err) {
      response.severity = "error";
      response.summary = "Request failed";
      response.detail = "Technical error, please contact support";
      res.send({ status: 200, toast: response });
    } else {
      response.severity = "success";
      response.summary = "Response";
      response.detail = "Blog Record deleted successfully!";
      res.send({ status: 200, toast: response });
    }
  });
});

router.post("/deleteCategory", [upload.single(), auth], function (req, res) {
  const { _id } = req.body;
  const { user_id } = req.user;

  let myquery = { _id: _id };

  var newvalues = { $set: { updatedBy: user_id, status: false } };

  CategoryModel.updateOne(myquery, newvalues, function (err, res2) {
    var response = {};
    if (err) {
      response.severity = "error";
      response.summary = "Request failed";
      response.detail = "Technical error, please contact support";
      res.send({ status: 200, toast: response });
    } else {
      response.severity = "success";
      response.summary = "Response";
      response.detail = "Category Record deleted successfully!";
      res.send({ status: 200, toast: response });
    }
  });
});

router.post(
  "/addPlatform",
  [upload.single("coverImg"), auth],
  function (req, res) {
    var response = {};
    const { user_id } = req.user;

    var plaformToSave = new PlatformModel({
      name: req.body.platformName,
      link: req.body.platformLink,
      rating: req.body.platformRating,
      cover: req.file.filename,
      destination: req.file.destination,
      createdBy: user_id,
    });

    plaformToSave.save(function (err, platform) {
      if (err) {
        response.severity = "error";
        response.summary = "Request failed";
        response.detail = "Technical error, please contact support";
        res.send({ status: 200, toast: response });
      } else {
        response.severity = "success";
        response.summary = "Response";
        response.detail = "Platform Record added successfully!";
        res.send({ status: 200, toast: response });
      }
    });
  }
);

router.post("/addBlog", [upload.single("coverImg"), auth], function (req, res) {
  var response = {};
  const { user_id } = req.user;
  const { blogName, blogTitle, blogDesc, blogShortDesc, blogCatmaster } =
    req.body;

  var blogToSave = new BlogModel({
    Name: blogName,
    ShortDesc: blogShortDesc,
    Desc: blogDesc,
    Title: blogTitle,
    Catmaster: blogCatmaster,
    cover: req.file.filename,
    destination: req.file.destination,
    createdBy: user_id,
  });

  blogToSave.save(function (err, platform) {
    if (err) {
      response.severity = "error";
      response.summary = "Request failed";
      response.detail = "Technical error, please contact support";
      res.send({ status: 200, toast: response });
    } else {
      response.severity = "success";
      response.summary = "Response";
      response.detail = "Blog Record added successfully!";
      res.send({ status: 200, toast: response });
    }
  });
});

router.post("/addCategory", [upload.single("coverImg"), auth], function (req, res) {
  const {user_id} = req.user;
  var response = {};
  var categoryToSave = new CategoryModel({
    name: req.body.categoryName,
    Catmaster: req.body.Catmaster,
    author: user_id, //req.body.authorName,
    cover: req.file.filename,
    destination: req.file.destination,
  });

  categoryToSave.save(function (err, category) {
    if (err) {
      response.severity = "error";
      response.summary = "Request failed";
      response.detail = "Technical error, please contact support";
      res.send({ status: 200, toast: response });
    } else {
      response.severity = "success";
      response.summary = "Response";
      response.detail = "Record added successfully!";
      res.send({ status: 200, toast: response });
    }
  });
});

router.get("/getPlatformsTableData", auth, function (req, res) {
  PlatformModel.find({ status: true }).then((response) => {
    let responseModifier = [];
    let platformDataHeaders = [
      { field: "name", header: "Name" },
      { field: "rating", header: "Rating" },
      { field: "link", header: "Link" },
      { field: "featured", header: "Featured" },
    ];
    response.forEach((responseElement) => {
      platformData = [
        { id: 1, name: "sdf", rating: "23", link: "23" },
        { id: 2, name: "sdf", rating: "23", link: "23" },
        { id: 3, name: "sdf", rating: "23", link: "23" },
      ];
      let tempObj = {
        id: responseElement._id,
        name: responseElement.name,
        link: responseElement.link,
        rating: responseElement.rating,
        featured: responseElement.featured,
      };
      responseModifier.push(tempObj);
    });
    res.send({ data: responseModifier, headers: platformDataHeaders });
  });
});

router.get("/getBlogsTableData", auth, async (req, res) => {
  let response = await BlogModel.find({ status: true });
  let responseModifier = [];
  let blogDataHeaders = [
    { field: "name", header: "Name" },
    { field: "title", header: "Title" },
    { field: "shortDesc", header: "Short Desc" },
    { field: "desc", header: "Desc" },
    { field: "featured", header: "Featured" },
  ];
  response.forEach((responseElement) => {
    let tempObj = {
      id: responseElement._id,
      name: responseElement.Name,
      title: responseElement.Title,
      shortDesc: responseElement.ShortDesc,
      desc: responseElement.Desc,
      featured: responseElement.featured,
    };
    responseModifier.push(tempObj);
  });
  res.send({ data: responseModifier, headers: blogDataHeaders });
});

router.get("/getUsersTableData", auth, async (req, res) => {
  const { user_id, role } = req.user;

  if (role !== constants.ROLE_SUPER_ADMIN) {
    res.send(403);
  } else {
    const response = await User_Mod.find({});
    const roleDropdown = await Master_Role_Mod.find({});
    for (let roleElement of roleDropdown) {
      roleElement.label = roleElement.name;
    }
    let platformDataHeaders = [
      { field: "name", header: "Name" },
      { field: "email", header: "Username" },
      {
        field: "roleName",
        header: "Role",
        inputType: "autocomplete",
        inputDropDownData: roleDropdown,
        parent: "role",
      },
    ];
    for (let responseElement of response) {
      responseElement.id = responseElement._id;
      const responseRole = await Master_Role_Mod.findOne({
        _id: responseElement.role,
      });
      if (responseRole) {
        responseElement.roleName = responseRole.name;
      }
    }

    res.send({ data: response, headers: platformDataHeaders });
  }
});

router.get("/getCourseTableData", auth, async (req, res) => {
  let request, requestQuery;
  const { user_id, role } = req.user;
  if (req.query.request && role === constants.ROLE_SUPER_ADMIN) {
    request = req.query.request;
    requestQuery = { Status: false };
  } else if (role === constants.ROLE_SUPER_ADMIN) {
    requestQuery = { Status: true };
  } else {
    requestQuery = { CreatedBy: user_id };
  }

  let response = await CourseModel.find(requestQuery);
  let responseModifier = [];
  let courseDataHeaders = [
    { field: "Name", header: "Name" },
    { field: "Name", header: "Name" },
    { field: "Description", header: "Description" },
    { field: "Rating", header: "Rating" },
    { field: "Price", header: "Price" },
    { field: "Level", header: "Level" },
    { field: "Cert", header: "Cert" },
    { field: "Duration", header: "Duration" },
    { field: "Category", header: "Category" },
    { field: "Platform", header: "Platform" },
    { field: "Catmaster", header: "Catmaster" },
    { field: "isFav", header: "isFav" },
    { field: "cover", header: "cover" },
  ];

  for (let responseElement of response) {
    let responsePlatform = await PlatformModel.findOne({
      _id: responseElement.Platform,
    });
    let responseCategory = await CategoryModel.findOne({
      _id: responseElement.Category,
    });

    let responseLevel = await Master_Level_Mod.findOne({
      _id: responseElement.Level,
    });

    let responseCert = await Master_Cert_Mod.findOne({
      _id: responseElement.Cert,
    });

    let responsePrice = await Master_Price_Mod.findOne({
      _id: responseElement.Price,
    });

    let responseType = await Master_Type_Mod.findOne({
      _id: responseElement.Type,
    });

    let responseCatmaster = await Coursemaster_Mod.findOne({
      _id: responseElement.Catmaster,
    });
    responseElement.CategoryName = responseCategory.name;
    responseElement.PlatformName = responsePlatform.name;
    responseElement.LevelName = responseLevel.name;
    responseElement.CertificateName = responseCert.name;
    responseElement.PriceName = responsePrice.name;
    responseElement.TypeName = responseType.name;
    responseElement.CatmasterName = responseCatmaster.name;
  }
  res.send({ data: response, headers: courseDataHeaders });
});

//category table data
router.get("/getCategoryTableData", auth, async (req, res) => {
  const catmasterDropdown = await Coursemaster_Mod.find({});
  for (let catmasterElement of catmasterDropdown) {
    catmasterElement.label = catmasterElement.name;
  }

  const response = await CategoryModel.find({ status: true })
    let responseModifier = [];
    let categoryHeaders = [{ field: "name", header: "Name" }, 
    {
      field: "catmasterName",
      header: "Super Cateogory",
      inputType: "autocomplete",
      inputDropDownData: catmasterDropdown,
      parent: "Catmaster",
    },];
    for (let responseElement of response ) {
      const catmasterResponse = await Coursemaster_Mod.findOne({_id: responseElement.Catmaster});
      let tempObj = {
        id: responseElement._id,
        name: responseElement.name,
        catmasterName: catmasterResponse ? catmasterResponse.name : ''
      };
      console.log(tempObj, catmasterResponse);
      responseModifier.push(tempObj);
    }
    res.send({ data: responseModifier, headers: categoryHeaders });
});

//get platforms for dropdown
router.get("/getPlatforms", function (req, res) {
  PlatformModel.find({ status: true }).then((response) => {
    let responseModifier = [];
    response.forEach((responseElement) => {
      let tempObj = {
        id: responseElement._id,
        src: responseElement.destination + responseElement.cover,
        label: responseElement.name,
      };
      responseModifier.push(tempObj);
    });
    res.send({ data: responseModifier });
  });
});

//get Categories for dropdown
router.get("/getCategories", function (req, res) {
  CategoryModel.find().then((response) => {
    let responseModifier = [];
    response.forEach((responseElement) => {
      let tempObj = {
        id: responseElement._id,
        src: responseElement.destination + responseElement.cover,
        label: responseElement.name,
      };
      responseModifier.push(tempObj);
    });
    res.send({ data: responseModifier });
  });
});

//getPrices
router.get("/getMasters", function (req, res) {
  const type = req.query.type;
  const differModel = MasterTypes[type];
  differModel.find().then((response) => {
    let responseModifier = [];
    response.forEach((responseElement) => {
      let tempObj = {
        id: responseElement._id,
        src: responseElement.destination + responseElement.cover,
        label: responseElement.name,
      };
      responseModifier.push(tempObj);
    });
    res.send({ data: responseModifier });
  });
});

module.exports = router;
