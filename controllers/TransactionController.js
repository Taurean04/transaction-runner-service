const sequelize = require ('../config/database');
const Transaction = require("../models").transaction;
const userWallet = require("../models").userWallet;
const { body, param, query, validationResult } = require('express-validator');
const {walletUtility} = require("../middleware");
const {creditUserWallet} = walletUtility;

// Create and Save a new Transaction
exports.createTransaction = async (req, res) => {    
    // Create a Transaction
    const {payload} = req.body;
    
    const t = await sequelize.transaction ();

    try {
        

        let getUserBalance = await userWallet.findAll({where:{userId:payload.userId}});
           
        let userBalance = getUserBalance[0].balance;
        
        if(payload.transactionType === 'credit'){
           //let creditUser = await creditUserWallet(payload);
           
            await Transaction.create({...payload},{Transaction:t});

            let newUserBalance = parseInt(userBalance) + parseInt(payload.amount);

            await userWallet.update({balance:newUserBalance},{where:{userId:payload.userId}});

            return res.status(200).json({message:"user wallet credited"})

        }else if(payload.transactionType === 'debit'){

            if(payload.amount <= userBalance){

                await Transaction.create({...payload},{Transaction:t});
    
                let newUserBalance = parseInt(userBalance) - parseInt(payload.amount);
    
                await userWallet.update({balance:newUserBalance},{where:{userId:payload.userId}});
    
                return res.status(200).json({message:"user wallet debited"});

            }else{
                return res.status(400).json({message:"Insufficient funds"});
            }
        }
    } catch (error) {
        console.log(error)
        await t.rollback();
        res.status(500).json({message: 'Error occurred', e});
    }

}


// Find a single Transaction with an id
exports.getTransactionById = async (req, res) => {
    const {id} = req.params;
    const t = await sequelize.transaction ();

    try {
        let transaction = await Transaction.findByPk(id, {transaction: t});
        if(transaction){
            await t.commit();
            res.status(200).json({TransactionInfo: transaction});
        }
        res.status(404).send({message: "Transaction with the specified ID does not exists"});
    } catch (e) {
        await t.rollback();
        console.log(e);
        res.status(500).json({message: "Error retrieving Transaction with id=" + id, e});
    }

};


exports.getAllUserTransactions = async (req, res) => {
    const {userId} = req.params;

    const t = await sequelize.transaction ();
    try {
        let transaction = await Transaction.findAll({where:{userId},
            order: [
            ['createdAt', 'DESC'],
        ]
    },{transaction: t});
        await t.commit();
        res.status(200).json({userTransactions: transaction});
    } catch (e) {
        await t.rollback();
        console.log(e);
        res.status(500).json({ message: 'Error occurred while retrieving transactions.', e});
    }

};

