var mongoose  =  require('mongoose');
var Schema  =  mongoose.Schema;

// our schema 

function dynamicSchema(postfix){
    var masterSchema = new Schema({
        name : {type : String},
        label : {type : String},
    });
    return mongoose.model( postfix, masterSchema);
}

module.exports = dynamicSchema;