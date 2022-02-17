var mongoose = require('mongoose');

var CategorySchema = mongoose.Schema({                                 //
    name: String,                                                    //
    // author: String,                                                //model creating
    cover: String,                                               //model creating
    destination: String,                                               //model creating
    createdBy: String,
    Catmaster: String,
    CatmasterName: String,
    updatedBy: String,
    status: {type: Boolean, default:true}
});
module.exports = mongoose.model("Categories", CategorySchema);