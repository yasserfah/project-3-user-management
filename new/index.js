const express=require('express')
var session = require('express-session')
const app=express()
const multer = require("multer")
const jwt = require('jsonwebtoken')
var bodyParser = require('body-parser')
const auth = require('C:/Users/admin/Downloads/code/day31/security-review-day4/auth')
var cookies = require("cookie-parser");
const fs = require('fs')
app.use(express.json())
app.use(express.urlencoded({extended:true}))

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

const mongoose=require('mongoose')
mongoose.connect('mongodb+srv://yasserfahmi1:2enhN0McqajZ0dwd@cluster0.oxd1tza.mongodb.net/',
{useNewUrlParser:true,
useCreateIndex:true,
useFindAndModify:false}).then(con=>{console.log('db connected')})

const Userschema=new mongoose.Schema({
Username:{type:String,unique:true},
Phone_Number:Number,
Age:Number,
Email:String,
Salary:String,
Password:String,
image:String
})
const Users=mongoose.model('Users',Userschema)
app.get('/login',(req,res)=>{
    res.render('registerlogin')

})
app.get('/addUser',(req,res)=>{
    res.render('addUser')
})
app.post('/addUser',upload.single("image"),async(req,res)=>{
    const {Username,Phone_Number,Age,Email,Salary,Password} = req.body
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(Password, 10);
    console.log(req.body)
    
    const image = req.file.filename
   const newUser = new Users({
         Username:Username,
        Phone_Number:Phone_Number,
        Age:Age,
        Email:Email,
        Salary:Salary,
        Password:hashedPassword,
        image:image
   })
   newUser.save().then(()=>{
    console.log('success')
   })
    
})
app.post('/login',async(req,res)=>{
   username=await Users.findOne({Username:req.body.Username})
   console.log(username)
   if(username){
    const isValid = bcrypt.compare(req.body.password,username.Password)
    if(isValid){
        const token = jwt.sign({firstname:username.Username,image:username.image},secret)
    res.cookie('token_auth',token)
    res.redirect('/dashboard')
   }}
})
const logger =(req,res,next)=>{
    const token = req.cookies.token_auth
    if(!token){
        return res.redirect('/register')
    }
    const decoded = jwt.verify(token,secret)
    const {firstname,image } = decoded
    req.firstname = firstname
    req.image = image
    next()
}
app.get('/dashboard',logger,(req,res)=>{
    res.render('dashboard',{firstname:req.firstname,image:req.image})
})





app.listen(5000,function(){
    console.log('server running on port 5000');
})