const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const groupdata = require('../models/group');
const userdata = require('../models/user');
const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
require('dotenv/config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const creategroup= async(req,res,next)=>{
    // console.log(req.body);
    try {
        const groupData = req.body;
        const invitationEmails = [];
        const groupUsers = [];
    
        for (const userData of groupData.users) {
          const user = await userdata.findOne({ email: userData.id });
    
          if (user) {
            groupUsers.push({ id: user._id, roal: userData.roal });
          } else {
            // Send invitation email here
            invitationEmails.push(userData.id);
            
          }
        }
        
    
        const userGroup = new groupdata({
          name: groupData.name,
          users: groupUsers
        });
        console.log(userGroup);
        const data=await userGroup.save();
        console.log("data"+data._id);
        for(const email of invitationEmails) {
            

            // async..await is not allowed in global scope, must use a wrapper
            async function main() {
              // Generate test SMTP service account from ethereal.email
              // Only needed if you don't have a real mail account for testing
              let testAccount = await nodemailer.createTestAccount();
            
              // create reusable transporter object using the default SMTP transport
              const transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                auth: {
                    user: 'gaetano.murazik91@ethereal.email',
                    pass: 'MfDM6qXQMwF8EaDaww'
                }
            });
            
              // send mail with defined transport object
              let info = await transporter.sendMail({
                from: 'gaetano.murazik91@ethereal.email', // sender address
                to: `${email}` , // list of receivers
                subject: "Hello ✔", // Subject line
                text: "Hello world?", // plain text body
                html: `<b>Hello world?</b><br><a href='http://localhost:4200/auth/mailregister/${data._id}'>Click hear</a>`, // html body
              });
            
              console.log("Message sent: %s", info.messageId);
              // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
            
              // Preview only available when sending through an Ethereal account
              console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
              // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
            }
            main()
            
                    }
        res.status(200).json({ message: 'Group created successfully' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
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
    const id= new mongoose.Types.ObjectId(req.body.userid);
    try{
        await groupdata.findById(req.body.groupid)
    .then(async (group) => {
      group.users.pull(id);
      if(req.body.roal=='admin')
      {
        group.users[0].roal = 'admin';
      }
      return await group.save()
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