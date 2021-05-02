const Sequelize = require('sequelize')
const ClienteSchema = require('./clienteSchema');

const EnderecoSchema = {
    schema: {
        id: {
            type: Sequelize.INTEGER,
            required: true,
            primaryKey: true,
            autoIncrement: true,
        },
        pais: {
            type: Sequelize.STRING(50),
            require: true,
            allowNull: false,
            
        },
        estado: {
            type: Sequelize.STRING(50),
            require: true,
            allowNull: false,
            
        },
        cidade: {
            type: Sequelize.STRING(50),
            require: true,
            allowNull: false,
            
        },
        bairro: {
            type: Sequelize.STRING(50),
            require: true,
            allowNull: false,
            
        },
        rua: {
            type: Sequelize.STRING(70),
            require: true,
            allowNull: false,
            
        },
        numero: {
            type: Sequelize.STRING(6),
            require: true,
            allowNull: false,
            
        },
        cep: {
            type: Sequelize.STRING(20),
            require: true,
            allowNull: false,
            
        },
        latitude: {
            type: Sequelize.STRING(50),
            require: false,
            allowNull: true,
            
        },
        longitude: {
            type: Sequelize.STRING(50),
            require: false,
            allowNull: true,
            
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
        tableName: 'Endereco',
        freezeTableName: false,
        timestamps: false,

      }

}

module.exports = EnderecoSchema