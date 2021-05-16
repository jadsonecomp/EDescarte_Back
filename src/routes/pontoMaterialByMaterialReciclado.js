const BaseRoute = require('./base/baseRoute')
const Joi = require('joi')

const pontoMaterialRoute = 'ponto_material'
const pontoMaterialByMaterialRecicladoRoute = 'ponto_material_reciclado'


class PontoMaterialByMaterialRecicladoRoute extends BaseRoute {
    constructor(db, tablePath) {
        super()
        this.db = db
        this.tablePath = tablePath
    }

    
    listPontoMaterialByMaterialReciclado() {

        if(`${this.tablePath}` === pontoMaterialRoute){

            return {
                path: `/${pontoMaterialByMaterialRecicladoRoute}/{id_material_reciclado}`,
                method: 'GET',
                config: {
                    description: `Listar ${this.tablePath}`,
                    notes: `Busca o dado da tabela ${this.tablePath} pelo id_material_reciclado`,
                    tags: ['api'], // ADD THIS TAG
                    validate: {
                        headers: Joi.object({
                            authorization: Joi.string().required()
                        }).unknown()
                    }
                },
                handler: (request, headers) => {
                    const id_material_reciclado = request.params.id_material_reciclado;
                    
                    return this.db.read({
                        id_material_reciclado: id_material_reciclado
                    })
                }
            }

        }
    }
    

}

module.exports = PontoMaterialByMaterialRecicladoRoute