module.exports = PlatformModel = require("../models/Platform_model.js");
module.exports = BlogModel = require("../models/Blog_model.js");
module.exports =  CategoryModel = require("../models/Category_model.js");
module.exports = CourseModel = require("../models/Course_model.js");
module.exports = UpvoteModel = require("../models/Upvote_model.js");
module.exports = FavModel = require("../models/Favourite_model.js");
module.exports = MasterModel = require("../models/Master_model.js");
module.exports = Master_Price_Mod = MasterModel("course_prices");
module.exports = Master_Level_Mod = MasterModel("course_levels");
module.exports = Master_Cert_Mod = MasterModel("course_certs");
module.exports = Master_Type_Mod = MasterModel("course_types");
module.exports = Master_Role_Mod = MasterModel("roles");
module.exports = Coursemaster_Mod = MasterModel("course_catmasters");
module.exports = User_Mod = require("../models/User_model.js");
module.exports = Toast = require("../models/Toast_model_response.js");