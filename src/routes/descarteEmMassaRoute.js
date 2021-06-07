const BaseRoute = require('./base/baseRoute')

const descarteEmMassaRoute = 'descarte_em_massa'
const descarteRoute = 'descarte'


class DescarteEmMassaRoute extends BaseRoute {
    constructor(db, tablePath) {
        super()
        this.db = db
        this.tablePath = tablePath
    }

    
    postDescarteEmMassa() {

        if(`${this.tablePath}` === descarteRoute){

            return {
                method: 'POST',
                path: `/${descarteEmMassaRoute}`,
    
                config: {
    
                        auth: false, //Não pedir autorização nessa rota
    
                        description: `Cadastrar ${descarteRoute}`,
                        notes: `Cadastra dados em massa na tabela ${descarteRoute}. \n
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
                        const descarteCad = await this.db.bulkCreate(payload);
                        return descarteCad;    
                    } catch (error) {
                        return error;    
                    }
                    
                }
            }
    

        }
    }
    

}

module.exports = DescarteEmMassaRoute