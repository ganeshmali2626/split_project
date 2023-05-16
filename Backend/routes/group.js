const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const chekAuth = require('../midelware/chek-auth');
const {creategroup,getgroups,groupgetSpec,removeUser,addUser,changeName}= require('../controllers/group-controllers')

router.route('/create').post(chekAuth,creategroup);
router.route('/get/:id').get(chekAuth,getgroups)
router.route('/getgroup/:postId').get(chekAuth,groupgetSpec)
router.route('/remove').patch(chekAuth,removeUser)
router.route('/add').patch(chekAuth,addUser)
router.route('/name/:groupId').put(chekAuth,changeName)

module.exports = router;