'use strict';

module.exports = (sequelize, DataTypes) => {
    const userWallet = sequelize.define("userWallet", {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        userId: {
            type: DataTypes.UUID
        },
        balance: {
            type: DataTypes.DECIMAL
        },
        walletCurrency: {
            type: DataTypes.ENUM('NGN')
        },
    });

    userWallet.associate = function(models){
      userWallet.belongsTo(models.user,{
        foreignKey: 'userId'
      });
    }

    return userWallet;
};