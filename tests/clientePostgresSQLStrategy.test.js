const { strictEqual, deepStrictEqual, ok } = require('assert');
const PostgresStrategy = require('../src/db/strategies/postgres/postgresSQLStrategy');
const ClienteSchema = require('../src/db/strategies/postgres/schemas/clienteSchema');
const Context = require('../src/db/strategies/base/contextStrategy');
const MOCK_CLIENTE_DEFAULT = { nome: 'OriginOne', documento: '15337868067', 
                                telefone: '75999990000', celular: '71900009999', 
                                email: 'algo@teste2.com', login: 'teste', senha: 'teste3@teste'};
const MOCK_CLIENTE_CADASTRAR = { nome: 'Eu mesmo', documento: '15338868067',  
                                telefone: '75789990000', celular: '71901109999', 
                                email: 'algo74@teste.com', login: 'teste10', senha: 'teste@teste'};
const MOCK_CLIENTE_ATUALIZAR = { nome: 'Teste Nome', email: 'teste@update.com' };


let context = {}

describe('Testando PostgreSQL Strategy no CRUD de cliente - clienteSchema', function() {
  this.timeout(Infinity);
  before(async () => {
    const connection = await PostgresStrategy.connect()
    const model = await PostgresStrategy.defineModel(connection, ClienteSchema)
    console.log('ClienteSchema.option: ', ClienteSchema.options)
    console.log('ClienteSchema.name: ', ClienteSchema.name)
    console.log('ClienteSchema.schema: ', ClienteSchema.schema)
    
    context = new Context(new PostgresStrategy(connection, model));
  
    await context.delete();
    await context.create(MOCK_CLIENTE_DEFAULT);
    //await context.create(MOCK_CLIENTE_ATUALIZAR);
  });

  it('PostgresSQL connection', async () => {
    const result = await context.isConnected();
    strictEqual(result, true);
  });

  it('cadastrar', async () => {
    const result = await context.create(MOCK_CLIENTE_CADASTRAR);
    
    delete result.dataValues.id;
    delete result.dataValues.criado_em;
    delete result.dataValues.alterado_em;

    deepStrictEqual(result.dataValues, MOCK_CLIENTE_CADASTRAR);
  });

  it('listar', async () => {
    const [result] = await context.read(MOCK_CLIENTE_DEFAULT);

    const novoItem = {
      ...MOCK_CLIENTE_DEFAULT,
      id: result.id,
      criado_em: result.criado_em,
      alterado_em: result.alterado_em,
    };

    deepStrictEqual(result, novoItem);
  });

  it('atualizar', async () => {
    const [result] = await context.read({});

    const novoItem = {
      ...MOCK_CLIENTE_DEFAULT,
      ...MOCK_CLIENTE_ATUALIZAR,
    };
    const [update] = await context.update(result.id, novoItem);

    deepStrictEqual(update, 1);
  });

  it('remover', async () => {
    const [item] = await context.read({});
    const result = await context.delete(item.id);
    deepStrictEqual(result, 1);
  });
});
