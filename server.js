var express=require("express");
var app=express();
var router= express.Router();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var morgan = require("morgan");
var jwt= require("jsonwebtoken");
 var webConfig = require("./config");

 var User = require("./models/user")
 app.use(morgan('dev'));
 app.set('secretkey',webConfig.SECRET);
 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({extended:true}))


 mongoose.connect(webConfig.DATABASECON,function()
 {
 	console.log("its connected to the database successfully");
 })

 router.get("/",function(request,response){
response.send("this is my json authentication app")

 })

router.post("/createUser",function(request,response){
var userObj=request.body;
User.createUser(userObj,function(err,data){
	if(err){
			throw err;
		}
		response.json(data);
})
})
router.get("/getUser/:name",function(request,response){
var userName  = request.params.name;
User.getUserByName(userName,function(err,data){
	if(err){
			throw err;
		}
		response.json(data);
})
})

router.post("/authenticate",function(request,response){
													// var body = request.body;
													// console.log(body);

	var userName =request.body.name;
	var password =request.body.password;
	User.getUserByName(userName,function(err,user)
	{
		if(err){
			throw err;

		}
		if(!user){
			response.json({
				success : false,
				message : "authentication failed,user not found"
			})
		}
		else if(user){
			if(user.password != password){

				response.json({
					success : false,
				message : "authentication failed,pasword not match"

				})
			}
			else{
				var token=jwt.sign(user,app.get('secretkey'))
				response.json({
					success : true,
					message : "here is your token",
					token : token
				})
			}
		}

	});
})
router.use(function(request,response,next){
 var token = request.body.token ||
   			request.query.token ||
   			request.headers["x-access-token"];
if(token){
 jwt.verify(token,app.get('secretkey'), function(err,decoded){
 	if(err){
 		response.json({
 			success : false,
 			message : "authentication failed,not a valid token"
 		})
 	}
 	request.decoded = decoded;
 	next();			
 })
}
else{

response.status(403).send({
	success : false,
	message : "please provide a token"
})
}

});
router.get("/getUser1",function(request,response){

User.getUsers(function(err,data){
	if(err){
			throw err;
		}
		response.json(data);
})
})

 app.use("/api",router);
 var PORT = process.env.PORT|| 1337;

 app.listen(PORT, function(){
	console.log("server listening to port" + PORT)
})