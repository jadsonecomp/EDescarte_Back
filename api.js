const {
    join
} = require('path')
const {
    config
} = require('dotenv')

const {
    ok
} = require('assert')

const env = process.env.NODE_ENV || "dev"
ok(env === "prod" || env === "dev", "environment inválida! Ou prod ou dev")

console.log(`Ambiente de ${env}`)

const configPath = join('./config', `.env.${env}`)

config({
    path: configPath
})



const Hapi = require('hapi')//require('@hapi/hapi')
const Joi = require('joi')
const Context = require('./src/db/strategies/base/contextStrategy')
const PostgresDB = require('./src/db/strategies/postgres/postgresSQLStrategy')
const ClienteSchema = require('./src/db/strategies/postgres/schemas/clienteSchema')
const EnderecoSchema = require('./src/db/strategies/postgres/schemas/enderecoSchema')
const PontoColetaSchema = require('./src/db/strategies/postgres/schemas/pontoColetaSchema')
const MaterialRecicladoSchema = require('./src/db/strategies/postgres/schemas/materialRecicladoSchema')
const PontoMaterialSchema = require('./src/db/strategies/postgres/schemas/pontoMaterialSchema')
const DescarteSchema = require('./src/db/strategies/postgres/schemas/descarteSchema')
const TabelasRoutes = require('./src/routes/tabelasRoutes')
const AuthRoutes = require('./src/routes/authRoutes')

const HapiSwagger = require('hapi-swagger')
const Inert = require('inert')//require('@hapi/inert')
const Vision = require('vision')//require('@hapi/vision')
const Jwt = require('jsonwebtoken')
const HapiJwt = require('hapi-auth-jwt2')
const MINHA_CHAVE_SECRETA = process.env.JWT_KEY

const swaggerConfig = {
    info: {
        title: 'API EDescarte',
        version: 'v1.0'
    },
    lang: 'pt'

}

let contextCliente = {}
let contextEndereco = {}
let contextPontoColeta = {}
let contextMaterialReciclado = {}
let contextPontoMaterial = {}
let contextDescarte = {}

const clienteRoute = 'cliente'
const enderecoRoute = 'endereco'
const pontoColetaRoute = 'ponto_coleta'
const materialRecicladoRoute = 'material_reciclado'
const pontoMaterialRoute = 'ponto_material'
const descarteRoute = 'descarte'

const app = new Hapi.Server({
    port: process.env.PORT//4000
})

function mapRoutes(instance, methods) {
    return methods.map(method => instance[method]())
}

async function main() {
    
    const connection = await PostgresDB.connect()
   
    const modelCliente = await PostgresDB.defineModel(connection, ClienteSchema)

    EnderecoSchema.schema.id_cliente.references.model = modelCliente

    const modelEndereco = await PostgresDB.defineModel(connection, EnderecoSchema)


    modelCliente.hasOne(modelEndereco, {
        constraint: true, 
        foreignKey: {
            name: 'id_cliente',
            allowNull: false},
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    
    modelEndereco.belongsTo(modelCliente, {
        constraint: true, 
        foreignKey: {
            name: 'id_cliente',
            allowNull: false},
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })

    
    PontoColetaSchema.schema.id_cliente.references.model = modelCliente

    const modelPontoColeta = await PostgresDB.defineModel(connection, PontoColetaSchema)
    
    modelCliente.hasOne(modelPontoColeta, {
        foreignKey: {
            name: 'id_cliente',
            allowNull: false},
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    
    modelPontoColeta.belongsTo(modelCliente, {
        foreignKey: {
            name: 'id_cliente',
            allowNull: false},
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })

    const modelMaterialReciclado = await PostgresDB.defineModel(connection, MaterialRecicladoSchema)
    
    const modelPontoMaterial = await PostgresDB.defineModel(connection, PontoMaterialSchema)

    modelPontoColeta.hasOne(modelPontoMaterial, {
        foreignKey: {
            name: 'id_ponto_coleta',
            allowNull: false},
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    
    modelPontoMaterial.belongsTo(modelPontoColeta, {
        foreignKey: {
            name: 'id_ponto_coleta',
            allowNull: false},
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    
    modelMaterialReciclado.hasMany(modelPontoMaterial, {
        foreignKey: {
            name: 'id_material_reciclado',
            allowNull: false},
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    
    modelPontoMaterial.belongsTo(modelMaterialReciclado, {
        foreignKey: {
            name: 'id_material_reciclado',
            allowNull: false},
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })

    const modelDescarte = await PostgresDB.defineModel(connection, DescarteSchema)

    modelCliente.hasOne(modelDescarte, {
        foreignKey: {
            name: 'id_cliente',
            allowNull: false},
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    
    modelDescarte.belongsTo(modelCliente, {
        foreignKey: {
            name: 'id_cliente',
            allowNull: false},
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    
    modelPontoColeta.hasMany(modelDescarte, {
        foreignKey: {
            name: 'id_ponto_coleta',
            allowNull: false},
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    
    modelDescarte.belongsTo(modelPontoColeta, {
        foreignKey: {
            name: 'id_ponto_coleta',
            allowNull: false},
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })

    const forceSyncCli = await modelCliente.sync({force: true});
    const forceSyncEnd = await modelEndereco.sync({force: true});
    const forceSyncPC = await modelPontoColeta.sync({force: true});
    const forceSyncMR = await modelMaterialReciclado.sync({force: true});
    const forceSyncPM = await modelPontoMaterial.sync({force: true});
    const forceSyncDes = await modelDescarte.sync({force: true});

    
    contextCliente = new Context(new PostgresDB(connection, modelCliente));

    contextEndereco = new Context(new PostgresDB(connection, modelEndereco));
    
    contextPontoColeta = new Context(new PostgresDB(connection, modelPontoColeta));

    contextMaterialReciclado = new Context(new PostgresDB(connection, modelMaterialReciclado));

    contextPontoMaterial = new Context(new PostgresDB(connection, modelPontoMaterial));
    
    contextDescarte = new Context(new PostgresDB(connection, modelDescarte));
    

    await app.register([
        HapiJwt,
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerConfig
        }
    ])

    app.auth.strategy('jwt', 'jwt', {
        key: MINHA_CHAVE_SECRETA,
        options: {
            expiresIn: 86400
        },
        validate: (dado, request) => {
            return {
                isValid: true
            }
        }
    })


    app.auth.default('jwt')

    // app.validator(Joi)
    app.route([

        ...mapRoutes(new TabelasRoutes(contextCliente, clienteRoute), TabelasRoutes.methods()),
        ...mapRoutes(new TabelasRoutes(contextEndereco, enderecoRoute), TabelasRoutes.methods()),
        ...mapRoutes(new TabelasRoutes(contextPontoColeta, pontoColetaRoute), TabelasRoutes.methods()),
        ...mapRoutes(new TabelasRoutes(contextMaterialReciclado, materialRecicladoRoute), TabelasRoutes.methods()),
        ...mapRoutes(new TabelasRoutes(contextPontoMaterial, pontoMaterialRoute), TabelasRoutes.methods()),
        ...mapRoutes(new TabelasRoutes(contextDescarte, descarteRoute), TabelasRoutes.methods()),
        ...mapRoutes(new AuthRoutes(MINHA_CHAVE_SECRETA, contextCliente), AuthRoutes.methods())

    ])

    
    await app.start()
    console.log('server running at', app.info.port)

    return app;
}

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});


module.exports = main()