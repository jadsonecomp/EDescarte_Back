const BaseRoute = require('./base/baseRoute')
const Joi = require('joi')

const enderecoRoute = 'endereco'
const enderecoByClienteRoute = 'endereco_cliente'


class EnderecoByClienteRoute extends BaseRoute {
    constructor(db, tablePath) {
        super()
        this.db = db
        this.tablePath = tablePath
    }

    
    listEnderecoByIdCliente() {

        if(`${this.tablePath}` === enderecoRoute){

            return {
                path: `/${enderecoByClienteRoute}/{id_cliente}`,
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

module.exports = EnderecoByClienteRoute