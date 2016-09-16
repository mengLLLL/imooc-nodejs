var express = require('express');
var path = require('path');
var mongoose = require("mongoose")
var serveStatic = require("serve-static")
var bodyParser = require("body-parser")
var port = process.env.PORT || 8080
var app = express()
mongoose.connect('mongodb://localhost/imooc')
app.set('views','./views/pages')
app.set('view engine','jade')
app.use(serveStatic('bower_components'))
app.use(bodyParser.urlencoded())
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
	})
	res.render('index',{
		title: 'imooc 首页',
		movies:[{
			title:'疯狂动物城',
			_id:1,
			poster:"http://img31.mtime.cn/pi/2015/10/27/095200.14690573_1000X1000.jpg"
		},{
			title:'疯狂动物城',
			_id:2,
			poster:"http://img31.mtime.cn/pi/2015/10/27/095200.14690573_1000X1000.jpg"
		},{
			title:'疯狂动物城',
			_id:3,
			poster:"http://img31.mtime.cn/pi/2015/10/27/095200.14690573_1000X1000.jpg"
		},{
			title:'疯狂动物城',
			_id:4,
			poster:"http://img31.mtime.cn/pi/2015/10/27/095200.14690573_1000X1000.jpg"
		},{
			title:'疯狂动物城',
			_id:5,
			poster:"http://img31.mtime.cn/pi/2015/10/27/095200.14690573_1000X1000.jpg"
		},{
			title:'疯狂动物城',
			_id:6,
			poster:"http://img31.mtime.cn/pi/2015/10/27/095200.14690573_1000X1000.jpg"
		}]
		
	})
})

//detail page
app.get('/movie/:id',function(req,res){
	res.render('detail',{
		title:'detail 详情',
		movies:{
			doctor:'mengl',
			country:'美国',
			title:'疯狂动物城',
			year:'2016',
			poster:"http://img31.mtime.cn/pi/2015/10/27/095200.14690573_1000X1000.jpg",
			language:'english',
			flash:'http://player.youku.com/player.php/sid/XMTUyNTIwMzIwOA==/v.swf',
			summary:'这是一座独一无二的现代动物都市，每种动物在这里都有自己的居所，比如富丽堂皇又炎热的撒哈拉广场，或者常年严寒的冰川镇。它就像一座大熔炉，动物们在这里和平共处——无论是大象还是小老鼠，只要努力，都能闯出一番名堂。不过乐观的..'
		}
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
//list page
app.get('/admin/list',function(req,res){
	res.render('list',{
		title:'list 首页',
		movie:{
			title:'疯狂动物城',
			_id:1,
			doctor:'mengl',
			country:'美国',
			year:'2016',
			language:'english',
			flash:'http://player.youku.com/player.php/sid/XMTUyNTIwMzIwOA==/v.swf',
		}
	})
})
