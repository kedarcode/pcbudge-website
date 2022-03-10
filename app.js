const express = require("express"); //import express
const path = require("path"); //import path
const app = express(); //create aoo
var hbs = require('hbs'); //import hbs
const cors=require("cors"); //import cors
const session=require('express-session');
const dotenv = require('dotenv');
dotenv.config({path:'config.env'});

const publicdirectory = path.join(__dirname,"./public") //create variable of public directory path
app.use(cors());    //use cors
app.use(express.static(publicdirectory)); // set public directiory with express
app.use('/auth/images/', express.static('./public/images')); //redirect auth to public for images
app.use('/request_data/', express.static('./public')); //redirect auth to public for images
app.use('/auth/', express.static('./public')); //same as above
app.use(express.urlencoded({extended:false})); //body parser for handinig string requests

app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false,
}))

app.use(express.json()); //body parser for handling json requests
app.set('view engine','hbs'); //set hbs as view engine

hbs.registerPartials(__dirname +'/views/partials'); //create partials path for hbs
hbs.registerHelper('ifeq', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
    });

app.use('/',require('./routes/pages'));
app.use('/request_data',require('./routes/request_data'));
app.use('/auth',require('./routes/auth'));
 
app.listen(3001,()=>
console.log("server started at 3001")
)