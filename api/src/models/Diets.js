const {DataTypes} = require('sequelize');

module.exports = (sequelize)=>{
    sequelize.define('diets',{
        ID: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        Nombre: {
            type: DataTypes.STRING,
            allowNull: false,
          },
    })
}