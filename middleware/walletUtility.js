const jwt = require("jsonwebtoken");
const dotenv = require('dotenv').config();
const sequelize = require ('../config/database');
const db = require('../models');
const Transaction = require("../models").transaction;
const userWallet = db.userWallet;
const walletCurrency = 'NGN';
const balance   =  0.00;

createUserWallet = async(userId) => {
        
    const t = await sequelize.transaction ();
    try {
        await userWallet.create({userId,walletCurrency,balance},{Transaction:t});
        await t.commit();
        return true;
    } catch (error) {
        return false;
    }
};

getUserBalance = async(userId) =>{
    const userWalletDetails = await userWallet.findAll({where:{userId}});
    const userBalance = userWalletDetails[0].balance;
    return userBalance;
}

creditUserBalance = async(amount,userId,userBalance) => {
    const addAmountToBalance = amount + userBalance;
    const t = await sequelize.transaction ();
    try {
        await userWallet.update({balance:addAmountToBalance},{where:{userId}});
        await t.commit();
        return true;
    } catch (error) {
        return false;
    }
}

creditUserWallet = async(payloadData) =>{
    const t = await sequelize.transaction ();
    try {
        await Transaction.create({...payloadData},{Transaction:t});
        
        let userBalance = await this.getUserBalance(payloadData.userId);

        let amount = parseInt(payloadData.amount);

        let creditUser = await this.creditUserBalance(amount,userId,userBalance);

        if(creditUser){
            await t.commit();
            return true;
        }

    } catch (error) {
        return false;
    }
}

const walletUtility = {createUserWallet,creditUserWallet};

module.exports = walletUtility;
  