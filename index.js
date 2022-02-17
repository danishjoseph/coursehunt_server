require('dotenv').config()
var express = require("express");
var path = require("path");
var platformRouter = require("./controllers/Editor.js");
var dashboardRouter = require("./controllers/dashboard.js");
var loginRouter = require("./controllers/login.js");
var ip= require('ip')
var app = express();
var bodyParser = require("body-parser");
var session = require("express-session");
var dir = path.join(__dirname, 'uploads/images');
var publidir = path.join(__dirname, 'public');
app.use('/uploads/images',express.static(dir));
app.use('/upload/images',express.static(dir));
app.use('/',express.static(publidir));
const PORT = process.env.PORT;

app.use(bodyParser.json()); 
// // app.use(session({secret: "storebase64"}));
app.use(bodyParser.urlencoded({ extended: false })); 
var mongoose = require("mongoose");
mongoose.set("bufferCommands", false);
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, route');
    res.setHeader('Access-Control-Allow-Credentials', true);
    // res.setHeader('Authorization', '*');
    next();
});

console.log('IP:::',ip.address());
console.log('connecting db with ip:'+ip.address())
mongoose
.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.error("connected");
})
.catch((err) => {
  console.log("not connected");
  console.error(err);
});
app.get('/',(req, res) => {

} )
setTimeout(() => {

}, 120000);

app.use("/api/editor", platformRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/login", loginRouter);
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
