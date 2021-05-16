const BaseRoute = require('./base/baseRoute')

const pontoMaterialEmMassaRoute = 'ponto_material_em_massa'
const pontoMaterialRoute = 'ponto_material'


class PontoMaterialEmMassaRoute extends BaseRoute {
    constructor(db, tablePath) {
        super()
        this.db = db
        this.tablePath = tablePath
    }

    
    postPontoMaterialEmMassa() {

        if(`${this.tablePath}` === pontoMaterialRoute){

            return {
                method: 'POST',
                path: `/${pontoMaterialEmMassaRoute}`,
    
                config: {
    
                        auth: false, //Não pedir autorização nessa rota
    
                        description: `Cadastrar ${pontoMaterialRoute}`,
                        notes: `Cadastra dados em massa na tabela ${pontoMaterialRoute}. \n
                                Necessário informar array com os pontos de Material`,
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
                        const pontosMaterialCad = await this.db.bulkCreate(payload);
                        return pontosMaterialCad;    
                    } catch (error) {
                        return error;    
                    }
                    
                }
            }
    

        }
    }
    

}

module.exports = PontoMaterialEmMassaRoute