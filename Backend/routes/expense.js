const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const chekAuth = require('../midelware/chek-auth');
const {addexpense,getexpense,deleteexpense}= require('../controllers/expense-controllers')

router.route('/create').post(chekAuth,addexpense);
router.route('/get/:groupid').get(chekAuth,getexpense);
router.route('/delete').patch(chekAuth,deleteexpense);
module.exports = router;