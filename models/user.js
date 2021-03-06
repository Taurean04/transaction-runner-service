'use strict';

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("user", {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        firstName: {
            type: DataTypes.STRING
        },
        lastName: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING
        }
    });

    User.associate = function(models){
      User.hasOne(models.userWallet,{
        foreignKey: 'userId',
        onDelete: 'CASCADE',
      })
      User.hasMany(models.transaction,{
        foreignKey: 'userId',
        onDelete: 'CASCADE',
      })
    }

    return User;
};