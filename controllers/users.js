const express=require('express')
var session = require('express-session')
const methodOverride = require('method-override')
const app=express()
const multer = require("multer")
const jwt = require('jsonwebtoken')
var bodyParser = require('body-parser')
const auth = require('C:/Users/admin/Downloads/code/day31/security-review-day4/auth')
var cookies = require("cookie-parser");
app.use(express.json())
app.use(express.urlencoded({extended:true}))
const mongoose=require('mongoose')
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
image:String,
role:{type:String,default:'client'},
verified:Boolean
})
const Users=mongoose.model('Users',Userschema)

exports.getlogin=(req,res)=>{
    res.render('registerlogin')
}
exports.getaddUser=async(req,res)=>{
    allusers=await Users.find()
    // console.log(allusers)
    res.render('addUser',{allusers})
}
exports.postaddUser=async(req,res)=>{
    
    const {Username,Phone_Number,Age,Email,Salary,Password,role,Verified} = req.body
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(Password, 10);
    // console.log(req.body)
    
    const image = req.file.filename
   
    // const valid = verified == 'on' ? true : false
    if (Verified=='on'){
        valid=true
    }
    else{valid=false}
    console.log(Verified)
    
   const newUser = new Users({
         Username:Username,
        Phone_Number:Phone_Number,
        Age:Age,
        Email:Email,
        Salary:Salary,
        Password:hashedPassword,
        image:image,
        role:role,
        verified:valid
   })
   newUser.save().then(()=>{
    console.log('success')
   })
   if(Users.Email=='yasser.fahmi1@gmail.com'){
    Users.role='admin'
   }
    
}


exports.postlogin=async(req,res)=>{
    
    username=await Users.findOne({Username:req.body.Username})
    if(username.role=='client'){
    // console.log(username)
    if(username){
     const isValid = bcrypt.compare(req.body.password,username.Password)
     if(isValid){
         const token = jwt.sign({firstname:username.Username,image:username.image},secret)
     res.cookie('token_auth',token)
     res.redirect('/dashboard')

    }}}
 
 else if(username.role=='admin'){
    res.redirect('/addUser')
 }
}

 exports.dashboard=(req,res)=>{
    res.render('dashboard',{firstname:req.firstname,image:req.image})
    console.log(req.firstname)
}
exports.ensureAdmin=(req,res,next)=>{
    if (Users.role=='admin'){next()}
    else {res.redirect('/dashboard')}
}
exports.deletee=async(req,res,next)=>{
    id=req.params.id
    await Users.deleteOne({ _id:id })
    res.redirect('/addUser')
}
exports.getedit=async(req,res) =>{
    try{
        const id = req.params.id
        const response = await Users.findOne({_id:id})
       
        res.render('edit',{ response})

    }catch(error){
        res.status(500).send('server problem')
    }
}
exports.putedit=async (req,res)=>{
    const {Username,Phone_Number,Age,Email,Salary,Password,role,Verified} = req.body
        const  id = req.params.id
        const newUser = req.body
        if(req.file){
            image = req.file.filename
        }
        if (Verified=='on'){
            valid=true
        }
        else{valid=false}
        console.log(`valid us ${valid}`)
        const updatedData = {
            Username:Username,
            Phone_Number:Phone_Number,
            Age:Age,
            Email:Email,
            Salary:Salary,
            Password:Password,
            image:image,
            role:'client',
            verified:valid
            
        }
        await Users.updateOne({ _id:id }, updatedData);
        res.redirect('/addUser')
    }

exports.sort= async(req,res)=>{
    const allusers = await Users.find().sort({Age:  1})
    res.render('addUser',{allusers})
}
exports.search=async(req,res)=>{
   const namee=req.query.values
   const allusers=await Users.find({Username: namee})
   res.render('addUser',{allusers})
    // console.log(allusers)
}