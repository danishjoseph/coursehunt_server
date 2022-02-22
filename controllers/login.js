var express = require("express");
var router = express.Router();
require("../models/index.js");
const bcrypt = require("bcryptjs");

// var PlatformModel = require("../models/Platform_model.js");
// var CategoryModel = require("../models/Category_model.js");
// var CourseModel = require("../models/Course_model.js");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const constants = require("../config/constants.js");

var upload = multer({});
router.post("/register", upload.single(), async (req, res) => {
  try {
    // Get user input
    const { fullname, username, password } = req.body;

    // Validate user input
    if (!(username && password && fullname)) {
      res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User_Mod.findOne({ email: username });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User_Mod.create({
      name: fullname,
      email: username.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
      role: req.body.role ? req.body.role : constants.ROLE_USER,
    });

    // Create token
    const token = jwt.sign(
      { user_id: user._id, username, role: user.role },
      "TOKEN_KEY",
      {
        expiresIn: "2h",
      }
    );
    // save user token
    user.token = token;
    const responseLoad = {
      token: token,
      status: 200,
      toast: {
        severity: "success",
        summary: "Response",
        detail: "Login successful",
      },
    };

    // return new user
    res.status(201).json(responseLoad);
  } catch (err) {
    console.log(err);
  }
});

router.post("/authenticate", upload.single(), async (req, res) => {
  try {
    // Get user input
    const { username, password } = req.body;

    // Validate user input
    if (!(username && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User_Mod.findOne({ email: username });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, username, role: user.role },
        "TOKEN_KEY",
        {
          expiresIn: "2h",
        }
      );

      user.token = token;
      user.password = "";
      user.updateAt = "123";
      user.updatedBy = "123";
      user.createdAt = "123";
      user.createdBy = "123";
      const responseLoad = {
        token: token,
        user: user,
        status: 200,
        toast: {
          severity: "success",
          summary: "Response",
          detail: "Login successful",
        },
      };

      // user
      res.status(200).json(responseLoad);
    }
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
});
// router.post('/', upload.single(), async (req, res) => {
//     const username = req.body.username
//     const password = req.body.password
//     if (!(username && password)) {
//       res.status(400).send("All input is required");
//     }
//     // Validate if user exist in our database
//     User_Mod.findOne({email: username}).then(response=>{
//         try {
//             const hasedEd = response.password
//             if (response
//                 && (await bcrypt.compare(password, hasedEd))
//                 // && (await bcrypt.compare(password, user.password))

//                 ) {
//               const token = jwt.sign(
//                 { user_id: response._id, username, role: response.role },
//                 'TOKEN_KEY',
//                 {
//                   expiresIn: "2h",
//                 }
//               );

//               // save user token
//               response.token = token;
//               const responseLoad = {
//                   token:token,
//                   status:200,
//                   toast: {
//                       severity: "success",
//                       summary: "Response",
//                       detail:'Login successful'
//                   }
//               }

//               // user
//               res.status(200).json(responseLoad);
//             }
//             else{
//                 res.status(400).send("Invalid Credentials");
//             }
//           } catch (err) {
//             console.log(err);
//           }
//     })
//   });

module.exports = router;
