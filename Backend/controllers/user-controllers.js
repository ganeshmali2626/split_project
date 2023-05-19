const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const userdata = require('../models/user');
const groupdata = require('../models/group');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// POST DATA

const postsignup= async(req,res,next)=>{
    userdata.find({name:req.body.name})
    .exec()
    .then(user=>{
        if(user.length>=1)
        {
            return res.status(401).json({
                error: 'User already exists',
            })
        }
        else{
    bcrypt.hash(req.body.password,10,(err,hash)=>{
   if(err){
    return res.status(500).json({
        error: err
    })
   } 
   else{
    const user = new userdata({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: hash
    })
    const data=user.save()
    .then(result=>{
        if (req.body.groupid){
        
            async function saveuse(){
                try{
                    await groupdata.findOne({ _id: req.body.groupid })
                     .then(async group => {
                        const newUsers=[{id:new mongoose.Types.ObjectId(result._id),roal:"user"}]
                         return await groupdata.findOneAndUpdate(
                           { _id: req.body.groupid },
                           { $addToSet: { users: { $each: newUsers } } },
                           { new: true }
                         );
                       })
                       res.json({message:"Added successfully"})
                 }catch(err){
                     res.json({message:err})
                 }
            }
            saveuse()
        }
        else{
            res.status(200).json({
                new_user: result
            })
        }
        
    })
    .catch(err=>{
        res.status(500).json({
            error: err
        })
    })
   }
})
}   
    })
}
const postlogin =(req, res,next) => {
    userdata.find({phone:req.body.phone})
    .exec()
    .then(user=>{
        if(user.length<1)
        {
            return res.status(401).json({
                error: 'User not found'
            })
        }
        bcrypt.compare(req.body.password,user[0].password,(err,result)=>{
            if(!result)
            {
                return res.status(401).json({
                    error:'invalid password'
                })
            }
            if(result)
            {
                const token = jwt.sign({
                    name: user[0].name,
                    email: user[0].email,
                    phone: user[0].phone,
                    
                },
                'this is ganesh',
                {
                    expiresIn: '24h'
                });
                res.status(200).json({
                    token: {token:token,id:user[0].id}
                })
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
}

//GET DATA
const usercontroll= async (req,res)=>{
    try{
        const users = await userdata.find();
        res.json(users);
    }catch(err){
        res.json({message:err})
    }
}

const getoneuser = async (req,res)=>{
    try{
    const users = await userdata.findById(JSON.parse(req.params.id)).select('-password');
    res.json(users);
    }catch(err){
        res.json({message:err})
    }
}



module.exports={postsignup,postlogin,usercontroll,getoneuser};