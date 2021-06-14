const Sequelize = require('sequelize')
const PontoColetaSchema = require('./pontoColetaSchema');

const CampanhaColetaSchema = {
    schema: {
        id: {
            type: Sequelize.INTEGER,
            required: true,
            primaryKey: true,
            autoIncrement: true,
        },
        descricao: {
            type: Sequelize.STRING(10000),
            require: true,
            allowNull: false,
            unique: false,
        },
        id_ponto_coleta: {
            type: Sequelize.INTEGER,
            require: true,
            allowNull: false,
            unique: false,

            references: {
              
              model: PontoColetaSchema,             
              key: 'id',                    
              deferrable: Sequelize.INITIALLY_IMMEDIATE,
              
            },
        },
        data_campanha: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
        },
        criado_em: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
        },
        alterado_em: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
        },

    },
    options: {
        
        tableName: 'Campanha_Coleta',
        freezeTableName: false,
        timestamps: false,

      }

}

module.exports = CampanhaColetaSchema