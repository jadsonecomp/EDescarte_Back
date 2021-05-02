const BaseRoute = require('./base/baseRoute')
const Joi = require('joi')
const Boom = require('boom')
const PasswordHelper = require('./../helpers/passwordHelper')

const Jwt = require('jsonwebtoken')

class AuthRoutes extends BaseRoute {
    constructor(key, db) {
        super()
        this.secret = key
        this.db = db
    }

    login() {

        return {
            path: '/login',
            method: 'POST',
            config: {
                auth: false,
                tags: ['api'],
                description: 'fazer login',
                notes: 'retorna o token',
                validate: {
                    payload: {
                        login: Joi.string().max(20).required(),
                        senha: Joi.string().max(20).required()
                    }
                }
            },
            handler: async (request, headers) => {
                const {
                    login,
                    senha
                } = request.payload

                const [user] = await this.db.read({
                    login: login//username.toLowerCase()
                })


                if (!user) {
                    return Boom.unauthorized('O usuario informado nao existe')
                }

                const match = await PasswordHelper.comparePassword(senha, user.senha)

                if (!match) {
                    return Boom.unauthorized('O usuario e senha invalidos!')
                }


                return {
                    token: Jwt.sign({
                        login: login
                    }, this.secret)
                }
            }
        }
    }
}
module.exports = AuthRoutes