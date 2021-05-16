const BaseRoute = require('./base/baseRoute')

const enderecoEmMassaRoute = 'endereco_em_massa'
const enderecoRoute = 'endereco'


class EnderecoEmMassaRoute extends BaseRoute {
    constructor(db, tablePath) {
        super()
        this.db = db
        this.tablePath = tablePath
    }

    
    postEnderecoEmMassa() {

        if(`${this.tablePath}` === enderecoRoute){

            return {
                method: 'POST',
                path: `/${enderecoEmMassaRoute}`,
    
                config: {
    
                        auth: false, //Não pedir autorização nessa rota
    
                        description: `Cadastrar ${enderecoRoute}`,
                        notes: `Cadastra dados em massa na tabela ${enderecoRoute}. \n
                                Necessário informar array com os endereços`,
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
                        const enderecoCad = await this.db.bulkCreate(payload);
                        return enderecoCad;    
                    } catch (error) {
                        return error;    
                    }
                    
                }
            }
    

        }
    }
    

}

module.exports = EnderecoEmMassaRoute