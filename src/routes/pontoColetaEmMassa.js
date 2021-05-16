const BaseRoute = require('./base/baseRoute')

const pontoColetaEmMassaRoute = 'ponto_coleta_em_massa'
const pontoColetaRoute = 'ponto_coleta'


class PontoColetaEmMassaRoute extends BaseRoute {
    constructor(db, tablePath) {
        super()
        this.db = db
        this.tablePath = tablePath
    }

    
    postPontoColetaEmMassa() {

        if(`${this.tablePath}` === pontoColetaRoute){

            return {
                method: 'POST',
                path: `/${pontoColetaEmMassaRoute}`,
    
                config: {
    
                        auth: false, //Não pedir autorização nessa rota
    
                        description: `Cadastrar ${pontoColetaRoute}`,
                        notes: `Cadastra dados em massa na tabela ${pontoColetaRoute}. \n
                                Necessário informar array com os pontos de coleta`,
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
                        const pontosColetaCad = await this.db.bulkCreate(payload);
                        return pontosColetaCad;    
                    } catch (error) {
                        return error;    
                    }
                    
                }
            }
    

        }
    }
    

}

module.exports = PontoColetaEmMassaRoute