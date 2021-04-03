'use strict';

module.exports = (sequelize, DataTypes) => {
    const Transaction = sequelize.define("transaction", {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        userId: {
            type: DataTypes.UUID
        },
        amount: {
            type: DataTypes.DECIMAL
        },
        comment: {
            type: DataTypes.TEXT
        },
        transactionType: {
            type: DataTypes.ENUM('credit', 'debit')
        },
        date: {
            type: DataTypes.DATE
        }
    });

    Transaction.associate = function(models){
      Transaction.belongsTo(models.user,{
        foreignKey: 'userId'
      });
    }

    return Transaction;
};