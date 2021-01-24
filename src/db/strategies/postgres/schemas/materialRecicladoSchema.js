const Sequelize = require('sequelize')

const MaterialRecicladoSchema = {
    schema: {
        id: {
            type: Sequelize.INTEGER,
            required: true,
            primaryKey: true,
            autoIncrement: true,
        },
        descricao: {
            type: Sequelize.STRING(100),
            require: true,
            allowNull: false,
            unique: false,
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
        //opcoes para base existente
        tableName: 'Material_Reciclado',
        freezeTableName: false,
        timestamps: false,

      }

}

module.exports = MaterialRecicladoSchema