const { strictEqual, deepStrictEqual, ok } = require('assert');
const PostgresStrategy = require('../src/db/strategies/postgres/postgresSQLStrategy');
const ClienteSchema = require('../src/db/strategies/postgres/schemas/clienteSchema');
const PontoColetaSchema = require('../src/db/strategies/postgres/schemas/pontoColetaSchema');
const Context = require('../src/db/strategies/base/contextStrategy');
const MOCK_CLIENTE_DEFAULT = { nome: 'PostoColetaOne', documento: '09337868067', 
                                telefone: '74919990000', celular: '71900009999', 
                                email: 'pc@teste2.com', login: 'pcoleta', senha: 'teste3@teste'};
let MOCK_PRODUTO_COLETA = { nome_fantasia: 'Nome Fantasia', id_cliente: ''};
const MOCK_PRODUTO_Atualizar = { nome_fantasia: 'Nome Fantasia Modificado'};


let contextCliente = {}
let contextPontoColeta = {}
let cliente_id = '';

let modelClienteDefault = '';


describe('Testando PostgreSQL Strategy no CRUD de Ponto de Coleta - pontoColetaSchema', function() {
  this.timeout(Infinity);
  before(async () => {
    
    const connection = await PostgresStrategy.connect()
    const modelCliente = await PostgresStrategy.defineModel(connection, ClienteSchema)
   
    PontoColetaSchema.schema.id_cliente.references.model = modelCliente
    
    const modelPontoColeta = await PostgresStrategy.defineModel(connection, PontoColetaSchema)
   

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

    modelClienteDefault = modelCliente;

    const forceSyncCli = await modelCliente.sync({force: true});
    const forceSyncPC = await modelPontoColeta.sync({force: true});
    
    
    contextCliente = new Context(new PostgresStrategy(connection, modelCliente));
    contextPontoColeta = new Context(new PostgresStrategy(connection, modelPontoColeta));
    
    await contextPontoColeta.delete();

    await contextCliente.delete();
    const cliente_default = await contextCliente.create(MOCK_CLIENTE_DEFAULT);

    cliente_id = cliente_default.dataValues.id;
    MOCK_PRODUTO_COLETA.id_cliente = cliente_id;
  });

  it('PostgresSQL connection', async () => {
    const result = await contextCliente.isConnected();
    const result2 = await contextPontoColeta.isConnected();
    strictEqual(result, true);
    strictEqual(result2, true);
  });

  it('cadastrar', async () => {
    
    const result = await contextPontoColeta.create(MOCK_PRODUTO_COLETA);

    // getModel() que é usado para pegar os dados da classe dependente
    // const clienteColeta = await result.getModel();
    // console.log('clienteColeta: ', clienteColeta)
    
    delete result.dataValues.id;

    deepStrictEqual(result.dataValues, MOCK_PRODUTO_COLETA);
  });

  it('listar', async () => {
    const [result] = await contextPontoColeta.read(MOCK_PRODUTO_COLETA);

    const novoItem = {
      ...MOCK_PRODUTO_COLETA,
      id: result.id,
    };

    deepStrictEqual(result, novoItem);
  });

  it('atualizar', async () => {
    const [result] = await contextPontoColeta.read({});

    const novoItem = {
      ...MOCK_PRODUTO_COLETA,
      ...MOCK_PRODUTO_Atualizar,
    };
    const [update] = await contextPontoColeta.update(result.id, novoItem);

    deepStrictEqual(update, 1);
  });

  it('remover', async () => {
    const [item] = await contextPontoColeta.read({});
    const result = await contextPontoColeta.delete(item.id);
    deepStrictEqual(result, 1);
  });

  it('PostgresSQL close connection cliente', async () => {
    const result = await contextCliente.closeConnection();
    strictEqual(result, true);
  });

  it('PostgresSQL close connection ponto coleta', async () => {
    const result = await contextPontoColeta.closeConnection();
    strictEqual(result, true);
  });
});
