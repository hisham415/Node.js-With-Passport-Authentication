const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const password = require('passport')
const User = require('../config/models/User')
const passport = require('passport')

router.get('/login', (req,res)=>{
    res.render('login')
})

router.get('/register', (req,res)=>{
    res.render('register')
})

//Register Handle
router.post('/register', (req,res)=>{
        const { name, email, password, password2 } = req.body; 
        let errors = [];
        
        //check required fields
        if(!name || !email || !password || !password2){
            errors.push({ msg: 'Please fill in all fields.' })
        }

        if(password !== password2){
            errors.push({ msg: 'Passwords do not match.'})
        }

        if(password.length<6){
            errors.push({msg: 'Passwords should be at least 6 characters.'})
        }

        if(errors.length>0){
            res.render('register',{
            errors,
            name,
            email,
            password,
            password2
        })
    }
    else{
       //validation pass
       User.findOne({ email: email })
       .then(user =>{
        if(user){
            errors.push({msg: 'Email is aready registered'});
            res.render('register',{
                errors,
                name,
                email,
                password,
                password2
            })
        } else{
            const newUser = new User({
                 name, 
                 email, 
                 password
            }) 
            //hash
            bcrypt.genSalt(10, (err, salt)=>{
                bcrypt.hash(newUser.password, salt, (err,hash)=>{
                    if(err){
                        throw err;
                    }
                    //set pass to hashed
                    newUser.password = hash;
                    //save user
                    newUser.save()
                    .then(user =>{
                        req.flash('success_msg','you are now registered and can log in');
                        res.redirect('/users/login')
                    })
                    .catch( err => console.log(err))


                })
            })
        }

       });
    }
})

// login handle

router.post('/login', (req,res,next)=>{
    passport.authenticate('local',{
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req,res,next);
})

//logout handle
    router.get('/logout', (req,res)=>{
        req.logout(function(err) {
            if (err) { return next(err); }
            req.flash('success_msg','you are logged out');
            res.redirect('/users/login')
            
          });
    })


module.exports = router