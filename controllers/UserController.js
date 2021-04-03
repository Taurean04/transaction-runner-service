const sequelize = require ('../config/database');
const User = require("../models").user;
const userWallet = require("../models").userWallet;
const Transaction = require("../models").transaction;
const { body, param, query, validationResult } = require('express-validator');
const {walletUtility} = require("../middleware");
const {createUserWallet} = walletUtility;

// Create and Save a new User
exports.createUser = async (req, res) => {    
    // Create a User
    const {payload} = req.body;
    
    const t = await sequelize.transaction ();

    // Save User in the database
    try {
        let data = await User.create({...payload}, {transaction: t});
        let userId = data.id;
        let createUserWalletFunction = createUserWallet(userId);
        if(!createUserWalletFunction){
            return res.status(401).json({message:'Unable to create wallet'});
        }
        await t.commit();
        res.status(200).json({message: 'User created successfully', data});
    } catch (e) {
        await t.rollback();
        console.log(e);
        res.status(500).json({message: 'Error occurred', e});
    }
};

// Find a single User with an id
exports.getUserById = async (req, res) => {
    const {id} = req.params;
    const t = await sequelize.transaction ();

    try {
        const userData = await User.findAll({
            where:{id}
        });

        const walletData = await userWallet.findAll({where:{userId:id}});
        const userTransactions = await Transaction.findAll({where:{userId:id},order: [
            ['createdAt', 'DESC'],
        ]})

        if(userData){
          return  res.status(200).json({userInfo: {userData,walletData,userTransactions}});
        }
        await t.commit();
        res.status(404).send({message: "User with the specified ID does not exists"});
    } catch (e) {
        await t.rollback();
        console.log(e);
        res.status(500).json({message: "Error retrieving User with id=" + id, e});
    }

};

// Update a User by the id in the request
exports.updateUser = async (req, res) => {
    const {id} = req.params;
    const {payload} = req.body;
    const t = await sequelize.transaction ();

    try {
        let data = await User.update(payload, {where: {id}}, {transaction: t});
        let updated = await User.findOne({ where: {id}}, {transaction: t});
        await t.commit();
        res.status(200).json({ userInfo: updated,  message: "User was updated successfully."});
    } catch (e) {
        await t.rollback();
        console.log(e);
        res.status(500).json({message: 'Error occurred', e});
    }

};

// Delete a User with the specified id in the request
exports.deleteUser = async (req, res) => {
    const {id} = req.params;
    const t = await sequelize.transaction ();

    try {
        let user = await User.update({where: {id}}, {transaction: t});
        if(data){
            await t.commit();
            res.status(200).send({message: "User was deleted successfully!"});
        }
        res.status(404).send({ message: "User with the specified ID does not exists"});
    } catch (e) {
        await t.rollback();
        console.log(e);
        res.status(500).send({message: "Could not delete User with id=" + id, e});
    }
};