const BaseRoute = require('./base/baseRoute')
const Joi = require('joi')
const PasswordHelper = require('./../helpers/passwordHelper')

const fetch = require('node-fetch');

const clienteRoute = 'cliente'
const enderecoRoute = 'endereco'
const pontoColetaRoute = 'ponto_coleta'
const materialRecicladoRoute = 'material_reciclado'
const pontoMaterialRoute = 'ponto_material'
const descarteRoute = 'descarte'

const nominatimURI = 'https://nominatim.openstreetmap.org/search?format=json&limit=3&q='
let latitude = ''
let longitude = ''

function atualizaCoordenadasGeometricas(uri){
    try {    
        return fetch(`${uri}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors'
        }).then(response => {
            return response.json();
            })  
        .then(json => {
                console.log('Coordenadas geométricas encontradas com sucesso')
                latitude = json[0].lat
                longitude = json[0].lon
                return json;  
            })    
        .catch(err => console.log('Request Failed - Erro ao buscar coordenadas geométricas: ', err)); 
    } catch (error) {
        console.log('ao buscar coordenadas geométricas: ', error)
    }
}



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
            config: {
                description: `Listar ${this.tablePath}`,
                notes: `Lista todos os dados da tabela ${this.tablePath}`,
                tags: ['api'], // ADD THIS TAG
                validate: {
                    headers: Joi.object({
                        authorization: Joi.string().required()
                    }).unknown()
                }
            },
            handler: (request, headers) => {
                return this.db.read()
            }
        }
    }
    listId() {
        return {
            path: `/${this.tablePath}/{id}`,
            method: 'GET',
            config: {
                description: `Listar ${this.tablePath}`,
                notes: `Busca o dado da tabela ${this.tablePath} pelo id`,
                tags: ['api'], // ADD THIS TAG
                validate: {
                    headers: Joi.object({
                        authorization: Joi.string().required()
                    }).unknown()
                }
            },
            handler: (request, headers) => {
                const id = request.params.id;
                
                return this.db.read({
                    id: id
                })
            }
        }
    }
    create() {
        
        if(`${this.tablePath}` === clienteRoute){

            return {
                path: `/${this.tablePath}`,
                method: 'POST',
                config: {

                    auth: false, //Não pedir autorização nessa rota

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
                            celular: Joi.string().max(20),
                            email: Joi.string().max(50).required(),
                            login: Joi.string().max(20).required(),
                            senha: Joi.string().max(20).required()
                        }
                    },

                },
                handler: async (request, headers) => {
                    const payload = request.payload
                    payload.senha = await PasswordHelper.hashPassword(payload.senha)
                    return this.db.create(payload)
                }
            }

        } else if(`${this.tablePath}` === enderecoRoute){

            return {
                path: `/${this.tablePath}`,
                method: 'POST',
                config: {

                    auth: false, //Não pedir autorização nessa rota

                    description: `Cadastrar ${this.tablePath}`,
                    notes: `Cadastra dados na tabela ${this.tablePath}. \n
                            Necessário informar os dados do país, bairro, cidade, rua, número, cep e o cliente`,
                    tags: ['api'], 

                    validate: {
                        failAction: (request, h, err) => {
                            throw err;
                        },
                        // headers: Joi.object({
                        //     authorization: Joi.string().required()
                        // }).unknown(),
                        payload: {
                            pais: Joi.string().max(50).required(),
                            estado: Joi.string().max(50).required(),
                            cidade: Joi.string().max(50).required(),
                            bairro: Joi.string().max(50).required(),
                            rua: Joi.string().max(70).required(),
                            numero: Joi.string().max(6).required(),
                            cep: Joi.string().max(20).required(),
                            latitude: Joi.string().min(0).max(50),
                            longitude: Joi.string().min(0).max(50),
                            id_cliente: Joi.number().required()
                        }
                    },

                },
                handler: async (request, headers) => {
                    const payload = request.payload

                    const uriCoords = `${nominatimURI}"${payload.rua}, ${payload.numero}, ${payload.bairro}, ${payload.cidade}"`
                    const coodGeometricas = await atualizaCoordenadasGeometricas(uriCoords)

                    payload.latitude = latitude
                    payload.longitude = longitude

                    return this.db.create(payload)
                }
            }

        } else if(`${this.tablePath}` === pontoColetaRoute){

            return {
                path: `/${this.tablePath}`,
                method: 'POST',
                config: {

                    auth: false, //Não pedir autorização nessa rota

                    description: `Cadastrar ${this.tablePath}`,
                    notes: `Cadastra dados na tabela ${this.tablePath}. \n
                            Necessário informar o nome fantasia da empresa e o id do cliente`,
                    tags: ['api'], 

                    validate: {
                        failAction: (request, h, err) => {
                            throw err;
                        },
                        // headers: Joi.object({
                        //     authorization: Joi.string().required()
                        // }).unknown(),
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
                        headers: Joi.object({
                            authorization: Joi.string().required()
                        }).unknown(),
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
                        headers: Joi.object({
                            authorization: Joi.string().required()
                        }).unknown(),
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
                        headers: Joi.object({
                            authorization: Joi.string().required()
                        }).unknown(),
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
                        headers: Joi.object({
                            authorization: Joi.string().required()
                        }).unknown(),
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
                        headers: Joi.object({
                            authorization: Joi.string().required()
                        }).unknown(),
                        payload: {
                            pais: Joi.string().max(50),
                            estado: Joi.string().max(50),
                            cidade: Joi.string().max(50),
                            bairro: Joi.string().max(50),
                            rua: Joi.string().max(70),
                            numero: Joi.string().max(6),
                            cep: Joi.string().max(20),
                            latitude: Joi.string().max(50),
                            longitude: Joi.string().max(50),
                            id_cliente: Joi.number()
                        },
                        params: {
                            id: Joi.string().required()
                        }
                    },

                },
                handler: async (request, headers) => {
                    const payload = request.payload;
                    const id = request.params.id;

                    // Vindo pela interface, sempre vou ter todos os campos
                    const uriCoords = `${nominatimURI}"${payload.rua}, ${payload.numero}, ${payload.bairro}, ${payload.cidade}"`
                    const coodGeometricas = await atualizaCoordenadasGeometricas(uriCoords)

                    payload.latitude = latitude
                    payload.longitude = longitude


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
                        headers: Joi.object({
                            authorization: Joi.string().required()
                        }).unknown(),
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
                        headers: Joi.object({
                            authorization: Joi.string().required()
                        }).unknown(),
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
                        headers: Joi.object({
                            authorization: Joi.string().required()
                        }).unknown(),
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
                        headers: Joi.object({
                            authorization: Joi.string().required()
                        }).unknown(),
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
                    headers: Joi.object({
                        authorization: Joi.string().required()
                    }).unknown(),
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