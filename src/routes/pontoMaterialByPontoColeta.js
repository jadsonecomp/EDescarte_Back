const BaseRoute = require('./base/baseRoute')
const Joi = require('joi')

const pontoMaterialRoute = 'ponto_material'
const pontoMaterialByPontoColetaRoute = 'ponto_material_coleta'


class PontoMaterialByPontoColetaRoute extends BaseRoute {
    constructor(db, db2, tablePath) {
        super()
        this.db = db
        this.db2 = db2
        this.tablePath = tablePath
    }

    
    listPontoMaterialByMaterialReciclado() {

        if(`${this.tablePath}` === pontoMaterialRoute){

            return {
                path: `/${pontoMaterialByPontoColetaRoute}/{id_ponto_coleta}`,
                method: 'GET',
                config: {
                    description: `Listar ${this.tablePath}`,
                    notes: `Busca o dado da tabela ${this.tablePath} pelo id_ponto_coleta`,
                    tags: ['api'], // ADD THIS TAG
                    validate: {
                        headers: Joi.object({
                            authorization: Joi.string().required()
                        }).unknown()
                    }
                },
                handler: async (request, headers) => {
                    const id_ponto_coleta = request.params.id_ponto_coleta;

                    const pontosMaterial = await this.db.read({
                        id_ponto_coleta: id_ponto_coleta
                    });
                    
                    // return this.db.read({
                    //     id_ponto_coleta: id_ponto_coleta
                    // })
                    return await pontosMaterial;
                }
            }

        }
    }


    deletePontoMaterialByMaterialReciclado() {

        if(`${this.tablePath}` === pontoMaterialRoute){

            return {
                path: `/${pontoMaterialByPontoColetaRoute}/{id_ponto_coleta}`,
                method: 'DELETE',
                config: {
                    description: `Listar ${this.tablePath}`,
                    notes: `Busca o dado da tabela ${this.tablePath} pelo id_ponto_coleta`,
                    tags: ['api'], // ADD THIS TAG
                    validate: {
                        headers: Joi.object({
                            authorization: Joi.string().required()
                        }).unknown()
                    }
                },
                handler: async (request, headers) => {
                    const id_ponto_coleta = request.params.id_ponto_coleta;

                    const pontosMaterial = await this.db.delete({
                        id_ponto_coleta: id_ponto_coleta
                    });

                    return await pontosMaterial;
                }
            }

        }
    }
    

}

module.exports = PontoMaterialByPontoColetaRoute