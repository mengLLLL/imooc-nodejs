var express = require('express');
var path = require('path');
var _ = require('underscore')
var mongoose = require("mongoose")
var serveStatic = require("serve-static")
var bodyParser = require("body-parser")
var Movie = require('./models/movie.js')
var User = require('./models/user.js')
var cookieSession = require('cookie-session')
var port = process.env.PORT || 8080
var app = express()

mongoose.connect('mongodb://127.0.0.1:27017/haha')
app.set('views','./views/pages')
app.set('view engine','jade')
app.use(serveStatic('bower_components'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(cookieSession())
// app.use(bodyParser.urlencoded())
// app.use(express.bodyParser())
// app.use(express.static(path.join(__dirname,'bower_components')))
app.listen(port)
console.log('imooc started on port '+port)

// index page
app.get('/',function(req,res){
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err)
		}
		res.render('index',{
		title: 'nodejs 首页',
		movies:movies
		
		})
	})
	
})

//detail page
app.get('/movie/:id',function(req,res){
	var id = req.params.id
	Movie.findById(id,function(err,movie){
		res.render('detail',{
		title:'detail 详情',
		movie:movie
		})
	})
})
//admin page
app.get('/admin/movie',function(req,res){
	res.render('admin',{
		title:'admin 录入',
		movie:{
			title:'',
			doctor:'',
			country:'',
			year:'',
			poster:'',
			flash:'',
			summary:'',
			language:''
		}
	})
})
//admin update movie
app.get('/admin/update/:id',function(req,res){
	var id = req.params.id
	if(id){
		Movie.findById(id,function(err,movie){
			res.render('admin',{
				title:'后台更新页' ,
				movie:movie
			})
		})
	}
})


//admin post movie
app.post('/admin/movie/new',function(req,res){
	console.log('req.body',req.body)
	var id = req.body.movie._id
	console.log('id',id)
	var movieObj = req.body.movie
	console.log(movieObj)
	var _movie
	if(id != 'undefined'){
		Movie.findById(id,function(err,movie){
			if(err){
				console.log(err)
			}
			_movie = _.extend(movie,movieObj)
			_movie.save(function(err,movie){
				if(err){
					console.log(err)
				}
				res.redirect('/movie/' + movie._id)
			})
		})
	}
	else{
		_movie = new Movie({
			doctor:movieObj.doctor,
			title:movieObj.title,
			country:movieObj.country,
			language:movieObj.language,
			year:movieObj.year,
			poster:movieObj.poster,
			summary:movieObj.summary,
			flash:movieObj.flash
		})
		_movie.save(function(err,movie){
			if(err){
					console.log(err)
				}
				res.redirect('/movie/' + movie._id)
		})
	}
})

//list page
app.get('/admin/list',function(req,res){
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err)
		}
		res.render('list',{
		title: 'list 首页',
		movies:movies
		})
	})
})
//signup
app.post('/user/signup',function(req,res){
	var _user = req.body.user
	//req.param('user')也可以拿到user
	
	User.findOne({name:_user.name},function(err,user){
		if(err){
			console.log(err)
		}
		if(user){
			return res.redirect('/')
		}else{
			var user = new User(_user);
			user.save(function(err,user){
				if(err){
					console.log(err)
				}
				console.log(user)
				res.redirect('/user/list')
			})
		}
	})
	
})
//user list
app.get('/user/list',function(req,res){
	User.fetch(function(err,users){
		if(err){
			console.log(err)
		}
		res.render('userlist',{
		title: '用户列表',
		users:users
		})
	})
})

//signin
app.post('/user/signin',function(req,res){
	var _user = req.body.user;
	var name = _user.name;
	var password = _user.password;
	User.findOne({name:name},function(err,user){
		if(err){
			console.log(err)
		}
		if(!user){
			return res.redirect('/')
		}
		user.comparePassword(password,function(err,isMatch){
			if(err){
				console.log(err)
			}
			if(isMatch){
				req.session.user = user
				console.log('password is matched')
				return res.redirect('/')
			}else{
				console.log('password is not matched')
			}
		})
	})
})
