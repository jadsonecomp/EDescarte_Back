const BaseRoute = require('./base/baseRoute')
const Joi = require('joi')

const clienteRoute = 'cliente'
const enderecoRoute = 'endereco'
const pontoColetaRoute = 'ponto_coleta'
const materialRecicladoRoute = 'material_reciclado'
const pontoMaterialRoute = 'ponto_material'
const descarteRoute = 'descarte'

class TabelasRoutes extends BaseRoute {
    constructor(db, tablePath) {
        super()
        this.db = db
        this.tablePath = tablePath
    }

    list() {
        return {
            path: `/${this.tablePath}`,
            method: 'GET',
            handler: (request, headers) => {
                return this.db.read()
            },
            options: {
                description: `Listar ${this.tablePath}`,
                notes: `Lista todos os dados da tabela ${this.tablePath}`,
                tags: ['api'] // ADD THIS TAG
            },
        }
    }
    create() {
        
        if(`${this.tablePath}` === clienteRoute){

            return {
                path: `/${this.tablePath}`,
                method: 'POST',
                config: {

                    description: `Cadastrar ${this.tablePath}`,
                    notes: `Cadastra dados na tabela ${this.tablePath}. \n
                            Necessário informar o nome, documento, telefone, email, login e senha do cliente`,
                    tags: ['api'], 

                    validate: {
                        failAction: (request, h, err) => {
                            throw err;
                        },
                        payload: {
                            nome: Joi.string().max(100).required(),
                            documento: Joi.string().max(14).required(),
                            telefone: Joi.string().max(20).required(),
                            email: Joi.string().max(50).required(),
                            login: Joi.string().max(20).required(),
                            senha: Joi.string().max(20).required()
                        }
                    },

                },
                handler: (request, headers) => {
                    const payload = request.payload
                    return this.db.create(payload)
                }
            }

        } else if(`${this.tablePath}` === enderecoRoute){

            return {
                path: `/${this.tablePath}`,
                method: 'POST',
                config: {

                    description: `Cadastrar ${this.tablePath}`,
                    notes: `Cadastra dados na tabela ${this.tablePath}. \n
                            Necessário informar os dados do país, bairro, cidade, rua, número, cep e o cliente`,
                    tags: ['api'], 

                    validate: {
                        failAction: (request, h, err) => {
                            throw err;
                        },
                        payload: {
                            pais: Joi.string().max(50).required(),
                            estado: Joi.string().max(50).required(),
                            cidade: Joi.string().max(50).required(),
                            bairro: Joi.string().max(50).required(),
                            rua: Joi.string().max(70).required(),
                            numero: Joi.string().max(6).required(),
                            cep: Joi.string().max(20).required(),
                            id_cliente: Joi.number().required()
                        }
                    },

                },
                handler: (request, headers) => {
                    const payload = request.payload
                    return this.db.create(payload)
                }
            }

        } else if(`${this.tablePath}` === pontoColetaRoute){

            return {
                path: `/${this.tablePath}`,
                method: 'POST',
                config: {

                    description: `Cadastrar ${this.tablePath}`,
                    notes: `Cadastra dados na tabela ${this.tablePath}. \n
                            Necessário informar o nome fantasia da empresa e o id do cliente`,
                    tags: ['api'], 

                    validate: {
                        failAction: (request, h, err) => {
                            throw err;
                        },
                        payload: {
                            nome_fantasia: Joi.string().max(100).required(),
                            id_cliente: Joi.number().required()
                        }
                    },

                },
                handler: (request, headers) => {
                    const payload = request.payload
                    return this.db.create(payload)
                }
            }

        } else if(`${this.tablePath}` === materialRecicladoRoute){

            return {
                path: `/${this.tablePath}`,
                method: 'POST',
                config: {

                    description: `Cadastrar ${this.tablePath}`,
                    notes: `Cadastra dados na tabela ${this.tablePath}. \n
                            Necessário informar o nome do material reciclado`,
                    tags: ['api'], 

                    validate: {
                        failAction: (request, h, err) => {
                            throw err;
                        },
                        payload: {
                            descricao: Joi.string().max(100).required()
                        }
                    },

                },
                handler: (request, headers) => {
                    const payload = request.payload
                    return this.db.create(payload)
                }
            }

        } else if(`${this.tablePath}` === pontoMaterialRoute){

            return {
                path: `/${this.tablePath}`,
                method: 'POST',
                config: {

                    description: `Cadastrar ${this.tablePath}`,
                    notes: `Cadastra dados na tabela ${this.tablePath}. \n
                            Tabela de ligação entre os materiais reciclados \n 
                            e pontos de coleta`,
                    tags: ['api'], 

                    validate: {
                        failAction: (request, h, err) => {
                            throw err;
                        },
                        payload: {
                            id_ponto_coleta: Joi.number().required(),
                            id_material_reciclado: Joi.number().required()
                        }
                    },

                },
                handler: (request, headers) => {
                    const payload = request.payload
                    return this.db.create(payload)
                }
            }

        } else if(`${this.tablePath}` === descarteRoute){

            return {
                path: `/${this.tablePath}`,
                method: 'POST',
                config: {

                    description: `Cadastrar ${this.tablePath}`,
                    notes: `Cadastra dados na tabela ${this.tablePath}. \n
                            Tabela responsável pelo os descartes realizados, é necessário informar descrição, status, o cliente e o ponto de coleta`,
                    tags: ['api'], 

                    validate: {
                        failAction: (request, h, err) => {
                            throw err;
                        },
                        payload: {
                            descricao: Joi.string().max(500).required(),
                            status: Joi.boolean().default(false),
                            id_cliente: Joi.number().required(),
                            id_ponto_coleta: Joi.number().required()
                        }
                    },

                },
                handler: (request, headers) => {
                    const payload = request.payload
                    return this.db.create(payload)
                }
            }

        }


    }
    update() {

        if(`${this.tablePath}` === clienteRoute){
            return {
                path: `/${this.tablePath}/{id}`,
                method: 'PATCH',
                config: {

                    description: `Atualizar ${this.tablePath}`,
                    notes: `Atualiza dados na tabela ${this.tablePath}.`,
                    tags: ['api'], 

                    validate: {
                        failAction: (request, h, err) => {
                            throw err;
                          },
                        payload: {
                            nome: Joi.string().max(100),
                            documento: Joi.string().max(14),
                            telefone: Joi.string().max(20),
                            email: Joi.string().max(50),
                            login: Joi.string().max(20),
                            senha: Joi.string().max(20)
                        },
                        params: {
                            id: Joi.string().required()
                        }
                    },

                },
                handler: (request, headers) => {
                    const payload = request.payload;
                    const id = request.params.id;
                    return this.db.update(id, payload)
                }
            }
        } else if(`${this.tablePath}` === enderecoRoute){
            return {
                path: `/${this.tablePath}/{id}`,
                method: 'PATCH',
                config: {

                    description: `Atualizar ${this.tablePath}`,
                    notes: `Atualiza dados na tabela ${this.tablePath}.`,
                    tags: ['api'], 

                    validate: {
                        failAction: (request, h, err) => {
                            throw err;
                        },
                        payload: {
                            pais: Joi.string().max(50),
                            estado: Joi.string().max(50),
                            cidade: Joi.string().max(50),
                            bairro: Joi.string().max(50),
                            rua: Joi.string().max(70),
                            numero: Joi.string().max(6),
                            cep: Joi.string().max(20),
                            id_cliente: Joi.number()
                        },
                        params: {
                            id: Joi.string().required()
                        }
                    },

                },
                handler: (request, headers) => {
                    const payload = request.payload;
                    const id = request.params.id;
                    return this.db.update(id, payload)
                }
            }
        } else if(`${this.tablePath}` === pontoColetaRoute){
            return {
                path: `/${this.tablePath}/{id}`,
                method: 'PATCH',
                config: {

                    description: `Atualizar ${this.tablePath}`,
                    notes: `Atualiza dados na tabela ${this.tablePath}.`,
                    tags: ['api'], 

                    validate: {
                        failAction: (request, h, err) => {
                            throw err;
                        },
                        payload: {
                            nome_fantasia: Joi.string().max(100),
                            id_cliente: Joi.number()
                        },
                        params: {
                            id: Joi.string().required()
                        }
                    },

                },
                handler: (request, headers) => {
                    const payload = request.payload;
                    const id = request.params.id;
                    return this.db.update(id, payload)
                }
            }
        } else if(`${this.tablePath}` === materialRecicladoRoute){
            return {
                path: `/${this.tablePath}/{id}`,
                method: 'PATCH',
                config: {

                    description: `Atualizar ${this.tablePath}`,
                    notes: `Atualiza dados na tabela ${this.tablePath}.`,
                    tags: ['api'], 

                    validate: {
                        failAction: (request, h, err) => {
                            throw err;
                        },
                        payload: {
                            descricao: Joi.string().max(100)
                        },
                        params: {
                            id: Joi.string().required()
                        }
                    },

                },
                handler: (request, headers) => {
                    const payload = request.payload;
                    const id = request.params.id;
                    return this.db.update(id, payload)
                }
            }
        } else if(`${this.tablePath}` === pontoMaterialRoute){
            return {
                path: `/${this.tablePath}/{id}`,
                method: 'PATCH',
                config: {

                    description: `Atualizar ${this.tablePath}`,
                    notes: `Atualiza dados na tabela ${this.tablePath}.`,
                    tags: ['api'], 

                    validate: {
                        failAction: (request, h, err) => {
                            throw err;
                        },
                        payload: {
                            id_ponto_coleta: Joi.number(),
                            id_material_reciclado: Joi.number()
                        },
                        params: {
                            id: Joi.string().required()
                        }
                    },

                },
                handler: (request, headers) => {
                    const payload = request.payload;
                    const id = request.params.id;
                    return this.db.update(id, payload)
                }
            }
        } else if(`${this.tablePath}` === descarteRoute){
            return {
                path: `/${this.tablePath}/{id}`,
                method: 'PATCH',
                config: {

                    description: `Atualizar ${this.tablePath}`,
                    notes: `Atualiza dados na tabela ${this.tablePath}.`,
                    tags: ['api'], 

                    validate: {
                        failAction: (request, h, err) => {
                            throw err;
                        },
                        payload: {
                            descricao: Joi.string().max(500),
                            status: Joi.boolean().default(false),
                            id_cliente: Joi.number(),
                            id_ponto_coleta: Joi.number()
                        },
                        params: {
                            id: Joi.string().required()
                        }
                    },

                },
                handler: (request, headers) => {
                    const payload = request.payload;
                    const id = request.params.id;
                    return this.db.update(id, payload)
                }
            }
        }


    }
    delete() {
        return {
            path: `/${this.tablePath}/{id}`,
            method: 'DELETE',
            config: {
                description: `Deletar ${this.tablePath}`,
                notes: `Deleta um dado da tabela ${this.tablePath} de acordo com o id informado
                        É obrigatório informar um id para realizar a operação`,
                tags: ['api'], // ADD THIS TAG

                validate: {
                    failAction: (request, h, err) => {
                        throw err;
                    },
                    params: {
                        id: Joi.string().required()
                    }
                }
            },
            handler: (request, headers) => {
                const id = request.params.id;
                return this.db.delete(id)
            }
        }
    }

}

module.exports = TabelasRoutes