var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({                                 //
    name: String,                                                    //
    email: {type: String, unique: true},
    password: String,
    createdAt:String,
    updateAt:String,
    createdBy:String,
    UpdatedBy:String,
    role:String,
    roleName: String,
    id: String,
    status: {type: Boolean, default: true}
});
module.exports = mongoose.model("Users", UserSchema);

