const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const expensedata = require('../models/expense');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const addexpense= async(req,res,next)=>{
    const temp=req.body.splitbetween.map((data)=>{
        return {userId:data,
            amount:parseFloat(req.body.amount/req.body.splitbetween.length).toFixed(2)}    
    })
    console.log(req.body.groupid);
    const expense = new expensedata({
        description:req.body.description,
          amount: req.body.amount,
          paidBy: JSON.parse(req.body.paidBy),
          groupid:req.body.groupid,
          splitBetween: req.body.splitbetween,
          splitAmounts: temp       
    })
    expense.save()
    .then(result=>{
        res.status(200).json({
            new_expense: expense
        })
    }).catch(err=>{
        res.status(500).json({
            error: err
        })
    }) 
}   

const getexpense= async (req,res)=>{
    try{
        const posts = await expensedata.find({ groupid: req.params.groupid })
        res.json(posts);
    }catch(err){
        res.json({message:err})
    }
}
const deleteexpense= async (req,res)=>{
    const id= new mongoose.Types.ObjectId(req.body.userid);
    try{
    expensedata.findById(req.body.groupid)
    .then((expense) => {
      expense.splitBetween.pull(id);
      expense.splitAmounts.pull({userId:req.body.userid, amount:req.body.amount})
      return expense.save();
    })
      res.json({message:"payed successfully"})
    }catch(err){
        res.json({message:err})
    }
        
}
module.exports={addexpense,getexpense,deleteexpense};