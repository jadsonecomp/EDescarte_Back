const BaseRoute = require('./base/baseRoute')
const Joi = require('joi')

const pontoColetaByClienteRoute = 'ponto_coleta_cliente'
const pontoColetaRoute = 'ponto_coleta'


class PontoColetaByClienteRoute extends BaseRoute {
    constructor(db, tablePath) {
        super()
        this.db = db
        this.tablePath = tablePath
    }

    
    listPontoColetaByClienteRoute() {

        if(`${this.tablePath}` === pontoColetaRoute){

            return {
                path: `/${pontoColetaByClienteRoute}/{id_cliente}`,
                method: 'GET',
                config: {
                    description: `Listar ${this.tablePath}`,
                    notes: `Busca o dado da tabela ${this.tablePath} pelo id_cliente`,
                    tags: ['api'], // ADD THIS TAG
                    validate: {
                        headers: Joi.object({
                            authorization: Joi.string().required()
                        }).unknown()
                    }
                },
                handler: (request, headers) => {
                    const id_cliente = request.params.id_cliente;
                    
                    return this.db.read({
                        id_cliente: id_cliente
                    })
                }
            }

        }
    }
    

}

module.exports = PontoColetaByClienteRoute