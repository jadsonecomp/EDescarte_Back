const Sequelize = require('sequelize')

const ClienteSchema = {
    schema: {
        id: {
            type: Sequelize.INTEGER,
            required: true,
            primaryKey: true,
            autoIncrement: true,
        },
        nome: {
            type: Sequelize.STRING(100),
            require: true,
            allowNull: false,
            unique: true,
        },
        documento: {
            type: Sequelize.STRING(14),
            require: true,
            allowNull: false,
            unique: true,
        },
        telefone: {
            type: Sequelize.STRING(20),
            require: true,
            allowNull: false,
        },
        celular: {
            type: Sequelize.STRING(20),
            //require: true,
        },
        email: {
            type: Sequelize.STRING(50),
            require: true,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        login: {
            type: Sequelize.STRING(20),
            require: true,
            allowNull: false,
            unique: true,
        },
        senha: {
            type: Sequelize.STRING(20),
            require: true,
            allowNull: false,
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
        tableName: 'Cliente',
        freezeTableName: false,
        timestamps: false,

      }

}

module.exports = ClienteSchema