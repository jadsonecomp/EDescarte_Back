const Sequelize = require('sequelize')

const DescarteSchema = {
    schema: {
        id: {
            type: Sequelize.INTEGER,
            required: true,
            primaryKey: true,
            autoIncrement: true,
        },
        descricao: {
            type: Sequelize.STRING(500),
            require: true,
            allowNull: false,
            unique: false,
        },
        status: {
            type: Sequelize.BOOLEAN,
            require: true,
            allowNull: false,
            unique: false,
            defaultValue: false,
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
        tableName: 'Descarte',
        freezeTableName: false,
        timestamps: false,

      }

}

module.exports = DescarteSchema