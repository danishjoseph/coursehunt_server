var mongoose = require('mongoose');

var blogSchema = mongoose.Schema({                                 //
    Name: String,                                                    //
    ShortDesc: String,                                                    //
    Desc: String,                                                    //
    Title: String,                                                    //
    cover: String,                                               //model creating
    destination: String,                                               //model creating
    createdBy: String,
    updatedBy: String,
    Catmaster: String,
    CatmasterName:String,
    status: {type: Boolean, default:true},
    featured: {type: Boolean, default:false}
});
module.exports = mongoose.model("Blogs", blogSchema);