const BaseRoute = require('./base/baseRoute')

const materialRecicladoEmMassaRoute = 'material_reciclado_em_massa'
const materialRecicladoRoute = 'material_reciclado'


class MaterialRecicladoEmMassaRoute extends BaseRoute {
    constructor(db, tablePath) {
        super()
        this.db = db
        this.tablePath = tablePath
    }

    
    postMaterialRecicladoEmMassa() {

        if(`${this.tablePath}` === materialRecicladoRoute){

            return {
                method: 'POST',
                path: `/${materialRecicladoEmMassaRoute}`,
    
                config: {
    
                        auth: false, //Não pedir autorização nessa rota
    
                        description: `Cadastrar ${materialRecicladoRoute}`,
                        notes: `Cadastra dados em massa na tabela ${materialRecicladoRoute}. \n
                                Necessário informar array com o nome do material reciclado`,
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
                        const perguntaCad = await this.db.bulkCreate(payload);
                        return perguntaCad;    
                    } catch (error) {
                        return error;    
                    }
                    
                }
            }
    

        }
    }
    

}

module.exports = MaterialRecicladoEmMassaRoute