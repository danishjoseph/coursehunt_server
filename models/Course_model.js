var mongoose = require("mongoose");

var courseSchema = mongoose.Schema({
  cover: String,
  Name: String,
  Description: String,
  Rating: String,
  Price: String,
  Level: String,
  Cert: String,
  Duration: String,
  Category: String,
  Platform: String,
  Type: String,
  Catmaster: String,
  Upvotes: String,
  isFav: Boolean,
  isVoted: Boolean,
  PlatformName:String,
  LevelName:String,
  CertificateName:String,
  PriceName:String,
  TypeName:String,
  CatmasterName:String,
  CategoryName:String,
  Status: Boolean,
  CreatedBy: String,
  UpdatedBy: String,
  CreatedAt:{type: String, default: new Date()},
  UpdatedAt:{type: String, default: new Date()}
});
module.exports = mongoose.model("Courses", courseSchema);
