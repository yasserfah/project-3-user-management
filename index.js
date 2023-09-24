const express=require('express')
var session = require('express-session')
const methodOverride = require('method-override')
const app=express()
const multer = require("multer")
const jwt = require('jsonwebtoken')
var bodyParser = require('body-parser')
const auth = require('C:/Users/admin/Downloads/code/day31/security-review-day4/auth')
var cookies = require("cookie-parser");
const fs = require('fs')
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"))


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})
var upload = multer({ storage: storage })


app.use(express.static('uploads'))
app.use(express.static('public'))
app.set('view engine', 'ejs')
app.use(express.static('public'))
const bcrypt=require('bcrypt')
const secret='cat'
app.use(cookies())



const userRouter = require('./routes/routes');
app.use('/',userRouter)





app.listen(5000,function(){
    console.log('server running on port 5000');
})