var mongoose = require('mongoose');

var platformSchema = mongoose.Schema({                                 //
    name: String,                                                    //
    rating: Number,                                                //model creating
    cover: String,                                               //model creating
    link: String,                                               //model creating
    destination: String,                                               //model creating
    createdBy: String,
    updatedBy: String,
    status: {type: Boolean, default:true},
    featured: {type: Boolean, default:false}
});
module.exports = mongoose.model("Platforms", platformSchema);