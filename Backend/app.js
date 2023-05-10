const express = require('express');
const bodyparser=require('body-parser')
const app = express();
const mongoose = require('mongoose');
require('dotenv/config');
const cors = require('cors');

app.use(cors());
app.use(bodyparser.json())
//Import routes

// const postRoute = require('./routes/posts');
const userRoute = require('./routes/user');
const groupRoute = require('./routes/group')
const expenseRoute = require('./routes/expense');


// app.use('/posts',postRoute)
app.use('/user',userRoute)
app.use('/group',groupRoute)
app.use('/expense',expenseRoute)

app.use((req,res,next)=>{
    res.status(404).json({
        message:'Bad Request'
    })
})
//connect
mongoose.connect(process.env.DB_CONNECTION,{useNewUrlParser:true});

const mongooseObject = mongoose.connection;

mongooseObject.on('error',(err)=>{

    console.log(err);

})

mongooseObject.once('open',()=>{

    console.log("connected succesfully");

})

//listen
app.listen(4000);