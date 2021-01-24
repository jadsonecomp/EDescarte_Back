const { strictEqual, deepStrictEqual, ok } = require('assert');
const PostgresStrategy = require('../src/db/strategies/postgres/postgresSQLStrategy');
const ClienteSchema = require('../src/db/strategies/postgres/schemas/clienteSchema');
const EnderecoSchema = require('../src/db/strategies/postgres/schemas/enderecoSchema');
const Context = require('../src/db/strategies/base/contextStrategy');
const MOCK_CLIENTE_DEFAULT = { nome: 'EnderecoOne', documento: '09337868067', 
                                telefone: '74919990000', celular: '71900009999', 
                                email: 'pc@teste2.com', login: 'pcoleta', senha: 'teste3@teste'};
let MOCK_ENDERECO = { pais: 'Brasil', estado: 'Bahia', cidade: 'Feira de Santana', bairro: 'Feira VI', rua: 'H', numero:'0', cep:'48013450'};
const MOCK_ENDERECO_Atualizar = { cidade: 'Alagoinhas'};


let contextCliente = {}
let contextEndereco = {}
let cliente_id = '';



describe('Testando PostgreSQL Strategy no CRUD de Endereço - enderecoSchema', function() {
  this.timeout(Infinity);
  before(async () => {
    
    const connection = await PostgresStrategy.connect()
    
    const modelCliente = await PostgresStrategy.defineModel(connection, ClienteSchema)
   
    EnderecoSchema.schema.id_cliente.references.model = modelCliente
    
    const modelEndereco = await PostgresStrategy.defineModel(connection, EnderecoSchema)
   

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

    const forceSyncCli = await modelCliente.sync({force: true});
    const forceSyncPC = await modelEndereco.sync({force: true});
    
    contextCliente = new Context(new PostgresStrategy(connection, modelCliente));
    contextEndereco = new Context(new PostgresStrategy(connection, modelEndereco));
    
    await contextEndereco.delete();

    await contextCliente.delete();
    const cliente_default = await contextCliente.create(MOCK_CLIENTE_DEFAULT);

    cliente_id = cliente_default.dataValues.id;
    MOCK_ENDERECO.id_cliente = cliente_id;
  });

  it('PostgresSQL connection', async () => {
    const result = await contextEndereco.isConnected();
    const result2 = await contextCliente.isConnected();
    strictEqual(result, true);
    strictEqual(result2, true);
  });

  it('cadastrar', async () => {
    
    const result = await contextEndereco.create(MOCK_ENDERECO);
    
    delete result.dataValues.id;

    deepStrictEqual(result.dataValues, MOCK_ENDERECO);
  });

  it('listar', async () => {
    const [result] = await contextEndereco.read(MOCK_ENDERECO);

    // const endereco = await result.contextCliente.result;
    // console.log(endereco);

    const novoItem = {
      ...MOCK_ENDERECO,
      id: result.id,
    };

    deepStrictEqual(result, novoItem);
  });

  it('atualizar', async () => {
    const [result] = await contextEndereco.read({});

    const novoItem = {
      ...MOCK_ENDERECO,
      ...MOCK_ENDERECO_Atualizar,
    };
    const [update] = await contextEndereco.update(result.id, novoItem);

    deepStrictEqual(update, 1);
  });

  it('remover', async () => {
    const [item] = await contextEndereco.read({});
    const result = await contextEndereco.delete(item.id);
    deepStrictEqual(result, 1);
  });

  it('PostgresSQL close connection cliente', async () => {
    const result = await contextCliente.closeConnection();
    strictEqual(result, true);
  });

  it('PostgresSQL close connection endereco', async () => {
    const result = await contextEndereco.closeConnection();
    strictEqual(result, true);
  });
});
