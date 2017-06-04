var mongoose=require("mongoose");
var customerSchema=mongoose.Schema({
	name : {
		type : String,
		required:true
	},
	password : {
		type : String,
		required:true
	},
	admin : {
		type : Boolean,
		required:true
	}
})
var User= module.exports=mongoose.model("user",customerSchema,"user");

module.exports.createUser = function(userObj,callback){

	return User.create(userObj,callback)
}

module.exports.getUserByName = function(userName ,callback){

	return User.findOne({name : userName },callback)
}
module.exports.getUsers = function(userName ,callback){

	return User.find( userName ,callback)
}