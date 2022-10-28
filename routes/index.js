const express = require('express')
const router = express.Router()
//welcome page
const {ensureAuthenticated} = require('../config/auth')


router.get('/', (req,res)=>{
    res.render('welcome')
})

//dashbboard
router.get('/dashboard', ensureAuthenticated ,(req,res)=> 
res.render('dashboard', {
    name: req.user.name
}));


module.exports = router