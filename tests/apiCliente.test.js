const assert = require('assert')
const api = require('./../api')
let app = {}
let MOCK_ID = ""

function cadastrar() {
    return app.inject({
        method: 'POST',
        url: '/cliente',
        payload: {
            nome: 'Jadson Silva5',
            documento: '04169706500',
            telefone: '75987542365',
            email: 'teste5@gmail.com',
            login: 'teste5',
            senha: 'teste5@teste'
        }
    });
}

function cadastrar2() {
    return app.inject({
        method: 'POST',
        url: '/cliente',
        payload: {
            nome: 'Jadson Alves',
            documento: '04169000000',
            telefone: '75965478541',
            email: 'algo@gmail.com',
            login: 'algoTeste',
            senha: 'algoTeste@teste'
        }
    });
}

describe('API EDescarte tabela Cliente test suite', function ()  {
    this.beforeAll(async () => {
        app = await api
        const result = await cadastrar2()
        MOCK_ID = JSON.parse(result.payload).id
    })

    it('listar /cliente', async () => {
        const result = await app.inject({
            method: 'GET',
            url: '/cliente'
        })
        const statusCode = result.statusCode 
        
        assert.strictEqual(statusCode, 200)
        assert.ok(Array.isArray(JSON.parse(result.payload)))
    })

    it('cadastrar /cliente', async () => {
        const result = await cadastrar()
        assert.strictEqual(result.statusCode, 200)
        assert.strictEqual(JSON.parse(result.payload).nome, "Jadson Silva5")

    })

    it('não deve cadastrar com payload errado', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/cliente',
            payload: {
                NAME: 'Flash'
            }
        })
        const payload = JSON.parse(result.payload)
        assert.strictEqual(result.statusCode, 400) 
        //assert.strictEqual(result.statusCode, 500)
        assert.ok(payload.message.search('"nome" is required') !== -1)
    })
    it('atualizar /cliente/{id}', async () => {
        console.log('MOCK_ID: ', MOCK_ID)
        const result = await app.inject({
            method: 'PATCH',
            url: `/cliente/${MOCK_ID}`,
            payload: {
                nome: 'Canário Negro',
                login: 'Grito'
            }
        })
        assert.strictEqual(result.statusCode, 200) 

    })
    it('remover /cliente/{id}', async () => {
        const result =  await app.inject({
            method: 'DELETE',
            url: `/cliente/${MOCK_ID}` 
        })
        assert.strictEqual(result.statusCode, 200) 
    })
})

