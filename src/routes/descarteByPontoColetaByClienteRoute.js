const BaseRoute = require('./base/baseRoute')
const Joi = require('joi')

const descarteRoute = 'descarte'
const descarteByPontoColetaRoute = 'descarte_ponto_coleta'
const descarteByClienteRoute = 'descarte_cliente'

class DescarteByPontoColetaByClienteRoute extends BaseRoute {
    constructor(db, tablePath) {
        super()
        this.db = db
        this.tablePath = tablePath
    }

    
    listDescarteByPontoColetaRoute() {

        if(`${this.tablePath}` === descarteRoute){

            return {
                path: `/${descarteByPontoColetaRoute}/{id_ponto_coleta}`,
                method: 'GET',
                config: {
                    description: `Listar ${this.tablePath}`,
                    notes: `Busca o dado da tabela ${this.tablePath} pelo id do ponto coleta`,
                    tags: ['api'], // ADD THIS TAG
                    validate: {
                        headers: Joi.object({
                            authorization: Joi.string().required()
                        }).unknown()
                    }
                },
                handler: (request, headers) => {
                    const id_ponto_coleta = request.params.id_ponto_coleta;
                    
                    return this.db.read({
                        id_ponto_coleta: id_ponto_coleta
                    })
                }
            }

        }
    }

    listDescarteByClienteRoute() {

        if(`${this.tablePath}` === descarteRoute){

            return {
                path: `/${descarteByClienteRoute}/{id_cliente}`,
                method: 'GET',
                config: {
                    description: `Listar ${this.tablePath}`,
                    notes: `Busca o dado da tabela ${this.tablePath} pelo id do cliente`,
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

module.exports = DescarteByPontoColetaByClienteRoute