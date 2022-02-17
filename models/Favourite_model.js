var mongoose = require('mongoose');

var FavSchema = mongoose.Schema({                                 //
    courseId: String,                                                    //
    createdBy: String,
    createdAt:{type: String, default: new Date()},
    status: {type: Boolean, default: true}
});
module.exports = mongoose.model("Course_favs", FavSchema);