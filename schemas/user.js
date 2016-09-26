var mongoose = require("mongoose")
var bcrypt = require("bcryptjs")
var SALT_WORK_FACTOR = 10
var UserSchema = new mongoose.Schema({
	name:{
		unique:true,
		type:String
	},
	password:{
		unique:true,
		type:String
	},
	meta:{
		createAt:{
			type:Date,
			default:Date.now()
		},
		updateAt:{
			type:Date,
			default:Date.now()
		}
	}
})
//pre是中间件，所以要传入next,并且写next()

UserSchema.pre('save',function(next){
	var user = this;
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now()
	}else{
		this.meta.updateAt = Date.now()
	}
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err,salt){
		if(err) return next(err)
		bcrypt.hash(user.password, salt, function(err,hash){
			if(err) return next(err)
			user.password = hash;
			next()
		})
	})


})
// exec是要执行的操作，参数是一个函数
UserSchema.statics = {
	fetch:function(cb){
		return this
			.find({})
			.sort('meta.updateAt')
			.exec(cb)
	},
	findById:function(id,cb){
		return this
			.findOne({_id:id})
			.exec(cb)
		}
}

UserSchema.methods = {
	comparePassword:function(_password,cb){
		bcrypt.compare(_password,this.password,function(err,isMatch){
			if(err){
				return cb(err)
			}
			cb(null,isMatch)
		})
	}
}
module.exports = UserSchema