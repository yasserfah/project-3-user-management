
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
const {getlogin,getaddUser,postaddUser,postlogin,dashboard,ensureAdmin,deletee,getedit,putedit,sort,search} = require('../controllers/users')



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




const router = express.Router()
router.get('/login',getlogin)
router.get('/addUser',getaddUser)
router.post('/addUser',upload.single("image"),postaddUser)
router.post('/login',postlogin)
router.get('/dashboard',logger,dashboard)
router.get('/delete/:id',deletee)
router.get('/edit/:id',getedit)
router.put('/edit/:id' , upload.single('image'),putedit)
router.get('/sort',sort)
router.get('/search/',upload.single("image"),search)
module.exports = router