const Sequelize = require('sequelize')

const PontoMaterialSchema = {
    schema: {
        id: {
            type: Sequelize.INTEGER,
            required: true,
            primaryKey: true,
            autoIncrement: true,
        },
        
    },
    options: {
        //opcoes para base existente
        tableName: 'Ponto_Material',
        freezeTableName: false,
        timestamps: false,

      }

}

module.exports = PontoMaterialSchema