const BaseRoute = require('./base/baseRoute')
const Joi = require('joi')
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
            }
        }
    }
    create() {
        return {
            path: `/${this.tablePath}`,
            method: 'POST',
            // config: {

            //     validate: {
            //         failAction: (request, h, err) => {
            //             throw err;
            //           },
            //         payload: {
            //             nome: Joi.string().max(100).required(),
            //             documento: Joi.string().max(14).required(),
            //             telefone: Joi.string().max(20).required(),
            //             email: Joi.string().max(50).required(),
            //             login: Joi.string().max(20).required(),
            //             senha: Joi.string().max(20).required()
            //         }
            //     },

            // },
            handler: (request, headers) => {
                const payload = request.payload
                return this.db.create(payload)
            }
            // options: {
            //     validate: {
            //         payload: Joi.object({
            //             nome: Joi.string().max(100).required(),
            //             documento: Joi.string().max(14).required(),
            //             telefone: Joi.string().max(20).required(),
            //             email: Joi.string().max(50).required(),
            //             login: Joi.string().max(20).required(),
            //             senha: Joi.string().max(20).required()
            //         })
            //     }
            // }
        }
    }
    update() {
        return {
            path: `/${this.tablePath}/{id}`,
            method: 'PATCH',
            config: {
                // validate: {
                //     failAction: (request, h, err) => {
                //         throw err;
                //       },
                //     payload: {
                //         nome: Joi.string().max(100),
                //         documento: Joi.string().max(14),
                //         telefone: Joi.string().max(20),
                //         email: Joi.string().max(50),
                //         login: Joi.string().max(20),
                //         senha: Joi.string().max(20)
                //     },
                //     params: {
                //         id: Joi.string().required()
                //     }
                // },

            },
            handler: (request, headers) => {
                const payload = request.payload;
                const id = request.params.id;
                return this.db.update(id, payload)
            }
        }
    }
    delete() {
        return {
            path: `/${this.tablePath}/{id}`,
            method: 'DELETE',
            config: {
                // validate: {
                //     failAction: (request, h, err) => {
                //         throw err;
                //     },
                //     params: {
                //         id: Joi.string().required()
                //     }
                // }
            },
            handler: (request, headers) => {
                const id = request.params.id;
                return this.db.delete(id)
            }
        }
    }

}

module.exports = TabelasRoutes