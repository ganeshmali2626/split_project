const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const groupdata = require('../models/group');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const creategroup= async(req,res,next)=>{
    groupdata.find({name:req.body.name})
    .exec()
    .then(group=>{
        if(group.length>=1)
        {groupdata
            return res.status(401).json({
                error: 'Group already exists',
            })
        }
        else{
    
    const group = new groupdata({
        name: req.body.name,
        users: req.body.users,
    })
    group.save()
    .then(result=>{
        res.status(200).json({
            new_group: result
        })
    })
    .catch(err=>{
        res.status(500).json({
            error: err
        })
    })
   }
})
}   
  
const getgroups= async (req,res)=>{
    const userIds = req.params.id.split(',');
    const id= new mongoose.Types.ObjectId(JSON.parse(userIds[0]));
    try{
        const posts = await groupdata.find({ 'users.id': { $in: [id] } })
        res.json(posts);
    }catch(err){
        res.json({message:err})
    }
}

const groupgetSpec = async (req,res)=>{
   
    console.log("params check",req.params.postId);
    try{
        const post = await groupdata.findById(req.params.postId).populate([
            {path:"users.id"}
        ]);
        res.json(post);
    }catch(err){
        res.json({message:err})
    }
}
const removeUser= async (req,res)=>{
    console.log(req.body);
    const id= new mongoose.Types.ObjectId(req.body.userid);
    try{
        await groupdata.findById(req.body.groupid)
    .then(async (group) => {
      group.users.pull(id);
      return await group.save();
    })
      res.json({message:"removed successfully"})
    }catch(err){
        res.json({message:err})
    }
        
}
const addUser=async (req,res)=>{
    
    const userIdsToAdd = req.body.userid.map((data)=>{
        return {id:new mongoose.Types.ObjectId(data.id),roal:data.roal}
    });
    console.log(userIdsToAdd);
    // const id= new mongoose.Types.ObjectId(req.body.userid);
    try{
       await groupdata.findOne({ _id: req.body.groupid })
        .then(async group => {
            const existingUsers = group.users;
            const newUsers = userIdsToAdd.filter(id => !existingUsers.includes(id));
        
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
const changeName=async (req,res)=>{
    try {
        // const groupId = req.params.groupId;
        // const { name } = req.body.name;
    console.log(req.params.groupId+" "+req.body.name);
        // Find the group by its ID
        const group = await groupdata.findById(req.params.groupId);
    
        if (!group) {
          return res.status(404).json({ error: 'Group not found' });
        }
    
        // Update the name of the group
        group.name = req.body.name;
        await group.save();
    
        res.json({ message: 'Group name updated successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }   
}
module.exports={creategroup,getgroups,groupgetSpec,removeUser,addUser,changeName};