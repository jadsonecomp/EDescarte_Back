const BaseRoute = require('./base/baseRoute')

const clienteEmMassaRoute = 'cliente_em_massa'
const clienteRoute = 'cliente'


class ClienteEmMassaRoute extends BaseRoute {
    constructor(db, tablePath) {
        super()
        this.db = db
        this.tablePath = tablePath
    }

    
    postClienteEmMassa() {

        if(`${this.tablePath}` === clienteRoute){

            return {
                method: 'POST',
                path: `/${clienteEmMassaRoute}`,
    
                config: {
    
                        auth: false, //Não pedir autorização nessa rota
    
                        description: `Cadastrar ${clienteRoute}`,
                        notes: `Cadastra dados em massa na tabela ${clienteRoute}. \n
                                Necessário informar array com os clientes`,
                        tags: ['api'], 
    
                        validate: {
                            failAction: (request, h, err) => {
                                throw err;
                            },
                        },
    
                },
    
                handler: async (request, h) => {
                    const payload = request.payload;
                    try {
                        const clienteCad = await this.db.bulkCreate(payload);
                        return clienteCad;    
                    } catch (error) {
                        return error;    
                    }
                    
                }
            }
    

        }
    }
    

}

module.exports = ClienteEmMassaRoute