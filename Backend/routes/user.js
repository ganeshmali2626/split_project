const chekAuth = require('../midelware/chek-auth');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const userdata = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {postsignup,postlogin,usercontroll,getoneuser,editdetails}= require('../controllers/user-controllers')

router.route('/signup').post(postsignup);
router.route('/login').post(postlogin)
router.route('/group').get(chekAuth,usercontroll)
router.route('/oneuser/:id').get(chekAuth,getoneuser)
router.route('/edit/:id').put(chekAuth,editdetails)


module.exports = router;