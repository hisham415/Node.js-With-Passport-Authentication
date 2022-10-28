const express = require('express');
const expressLayouts= require('express-ejs-layouts');
const mongoose = require('mongoose');
const app = express();
const flash = require('connect-flash')
const session = require('express-session')
const PORT = process.env.PORT || 5000
const passport = require('passport')

require('./config/passport')(passport); 

//dbconfig
const db = require('./config/keys').MongoURI;

// Connect to mongo 
mongoose.connect(db,{useNewUrlParser: true})
.then(()=> console.log('mongodb Connected'))    
.catch(err => console.log(err));
//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs')

//bodyparser
app.use(express.urlencoded({extended: false}))

//express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  }));

  
app.use(passport.initialize())
app.use(passport.session());


  //connect flash
  app.use(flash())

  //global vars
  app.use( (req,res,next) =>{
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next();
  })



//Routes
app.use('/',require('./routes/index'))
app.use('/users',require('./routes/user'))




app.listen(PORT, console.log(`server started on port ${PORT}`))
