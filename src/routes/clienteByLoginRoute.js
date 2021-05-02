const BaseRoute = require('./base/baseRoute')
const Joi = require('joi')

const clienteRoute = 'cliente'
const clienteByLoginRoute = 'cliente_login'


class ClienteByLoginRoute extends BaseRoute {
    constructor(db, tablePath) {
        super()
        this.db = db
        this.tablePath = tablePath
    }

    
    listClienteByLogin() {

        if(`${this.tablePath}` === clienteRoute){

            return {
                path: `/${clienteByLoginRoute}/{login}`,
                method: 'GET',
                config: {
                    description: `Listar ${this.tablePath}`,
                    notes: `Busca o dado da tabela ${this.tablePath} pelo login`,
                    tags: ['api'], // ADD THIS TAG
                    validate: {
                        headers: Joi.object({
                            authorization: Joi.string().required()
                        }).unknown()
                    }
                },
                handler: (request, headers) => {
                    const login = request.params.login;
                    
                    return this.db.read({
                        login: login
                    })
                }
            }

        }
    }
    

}

module.exports = ClienteByLoginRoute