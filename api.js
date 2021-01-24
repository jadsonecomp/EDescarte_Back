const Hapi = require('hapi')
const Joi = require('joi')
const Context = require('./src/db/strategies/base/contextStrategy')
const PostgresDB = require('./src/db/strategies/postgres/postgresSQLStrategy')
const ClienteSchema = require('./src/db/strategies/postgres/schemas/clienteSchema')
const EnderecoSchema = require('./src/db/strategies/postgres/schemas/enderecoSchema')
const PontoColetaSchema = require('./src/db/strategies/postgres/schemas/pontoColetaSchema')
const TabelasRoutes = require('./src/routes/tabelasRoutes')

let contextCliente = {}
let contextEndereco = {}
let contextPontoColeta = {}

const clienteRoute = 'cliente'
const enderecoRoute = 'endereco'
const pontoColetaRoute = 'ponto_coleta'

const app = new Hapi.Server({
    port: 4000
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
    
    const forceSyncCli = await modelCliente.sync({force: true});
    const forceSyncEnd = await modelEndereco.sync({force: true});
    const forceSyncPC = await modelPontoColeta.sync({force: true});

    
    contextCliente = new Context(new PostgresDB(connection, modelCliente));

    contextEndereco = new Context(new PostgresDB(connection, modelEndereco));
    
    contextPontoColeta = new Context(new PostgresDB(connection, modelPontoColeta));
    
    // app.validator(Joi)
    app.route([
        ...mapRoutes(new TabelasRoutes(contextCliente, clienteRoute), TabelasRoutes.methods()),
        ...mapRoutes(new TabelasRoutes(contextEndereco, enderecoRoute), TabelasRoutes.methods()),
        ...mapRoutes(new TabelasRoutes(contextPontoColeta, pontoColetaRoute), TabelasRoutes.methods())
    ])

    
    await app.start()
    console.log('server running at', app.info.port)

    return app;
}
module.exports = main()