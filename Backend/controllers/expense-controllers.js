const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const expensedata = require('../models/expense');
const groupdata = require('../models/group');
const userdata = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const addexpense= async(req,res,next)=>{
    try{
      if (req.body.amount===null || req.body.splitbetween===[] || req.body.groupid==='' || req.body.description==='' || req.body.paidBy==='') {
        
        res.status(400).json({
          error: 'Missing required data in the request body'
      })
        return;
      }
      const tempamount=req.body.amount/req.body.splitbetween.length;
    const temp=req.body.splitbetween.map((data)=>{
        return {userId:data.id,
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

    await userdata.updateOne(
        { _id: expense.paidBy },
        { $inc: { 'balance.credit': parseFloat(expense.amount- tempamount).toFixed(2) } }
      );

      expense.splitAmounts.map(async(item)=>{
        if(item.userId.toString()!==expense.paidBy.toString())
        {
        await userdata.updateOne(
            { _id: item.userId },
            { $inc: { 'balance.debit': parseFloat(item.amount).toFixed(2) } }
          );
        }
      })

     

    const createdExpense = await expense.save();
    const group = await groupdata.findById(req.body.groupid);
    if (!group) {
      throw new Error('Group not found');
    }

    group.expenses.push(createdExpense._id);
    await group.save();

    
    res.json({ message: 'Expense created successfully' });
}catch (err) {
    res.json({ message: err.message });
  }  
    
  } 

const getexpense= async (req,res)=>{
    try{
        const posts = await expensedata.find({ groupid: req.params.groupid }).populate([{path:"splitBetween.id"},{path:"paidBy"}])
        res.json(posts);
    }catch(err){
        res.json({message:err})
    }
}
const deleteexpense= async (req,res)=>{
    console.log(req.body);
    const id= new mongoose.Types.ObjectId(req.body.userid);
    console.log(id);
    try{
        const expense = await expensedata.findById(req.body.expid);
        if (!expense) {
          throw new Error("Expense not found");
        }
        await userdata.updateOne(
            { _id: expense.paidBy },
            { $inc: { 'balance.credit': parseFloat(-req.body.amount).toFixed(2)} }
          );
          await userdata.updateOne(
            { _id: id },
            { $inc: { 'balance.debit': parseFloat(-req.body.amount).toFixed(2) } }
          );
          const index = expense.splitBetween.findIndex(item => item.id.toString() === id.toString());
          console.log(index);

          if (index !== -1) {
            expense.splitBetween[index].paidstatus = 'true';
          }
        expense.splitAmounts.pull({ userId: id, amount: req.body.amount });
        await expense.save();
        res.json({ message: "paid successfully" });
    }catch(err){
        res.json({message:err})
    }
        
}
module.exports={addexpense,getexpense,deleteexpense};