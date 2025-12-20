const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../Models/userModels');


//Register: the front door for new people
router.post('/register',async(req,res) =>{
    //destructure role from the body sent by form
    const {name,email,password,role,adminCode} = req.body
    try{
        //SECURITY CHECK:only allow admin role if secret key matches
        if(role=='admin'){
            const SECRET_KEY = process.env.ADMIN_SECRET_KEY;
            if(adminCode !==SECRET_KEY){
                return res.status(403).json({error:'Invalid Admin secret key'});
            }
        }
        const newUser = new User({name,email,password,role});//this is where the database will save admin or user
        await newUser.save();
        //generating token  so they are logged in immediately after signing up
        const token = jwt.sign(
            {userId:newUser._id,role:newUser.role},
            process.env.JWT_SECRET,
            {expiresIn:'1h'}
        );
        res.status(201).json({message:'successful registered',token,role:newUser.role});
    } catch(error){
        console.error(error);
        res.status(400).json({
            error:error.message || 'registration failed'
        })
    }
});

//LOGIN:the front door for returning people
router.post('/login',async(req,res) =>{
    const{email,password} = req.body;
    try{
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({error:'user not found'});//this is fixed 'user'to user

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch) return  res.status(401).json({error:'invalid credentials'});
        //generate token 
        const token = jwt.sign({userId:user._id ,role:user.role},process.env.JWT_SECRET,{ expiresIn:'1h'});
        res.json({ token ,role:user.role}); 
    } catch(error) {
        res.status(500).json({error:'Server error'});
    }
});
module.exports = router;