const Sequelize = require('sequelize')
const ClienteSchema = require('./clienteSchema');
const PostgresStrategy = require('../postgresSQLStrategy');

//const connection = async function() {return await PostgresStrategy.connect()};
//const modelCliente = async function() {await PostgresStrategy.defineModel(connection, ClienteSchema)}

const PontoColetaSchema = {
    schema: {
        id: {
            type: Sequelize.INTEGER,
            required: true,
            primaryKey: true,
            autoIncrement: true,
        },
        nome_fantasia: {
            type: Sequelize.STRING(100),
            require: true,
            unique: true,
        },
        id_cliente: {
            type: Sequelize.INTEGER,
            require: true,
            allowNull: false,
            unique: true,

            references: {
              
              //model: modelCliente,
              model: ClienteSchema,             
              key: 'id',                    
              deferrable: Sequelize.INITIALLY_IMMEDIATE,
              
            },
          },
    },
    options: {
        //opcoes para base existente
        tableName: 'Ponto_Coleta',
        freezeTableName: false,
        timestamps: false,
    }

}

module.exports = PontoColetaSchema