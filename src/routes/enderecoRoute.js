const BaseRoute = require('./base/baseRoute')

class EnderecoRoute extends BaseRoute {
    constructor(db) {
        super()
        this.db = db
    }

    list() {
        return {
            path: '/endereco',
            method: 'GET',
            handler: (request, headers) => {
                return this.db.read()
            }
        }
    }
    create() {
        return {
            path: '/endereco',
            method: 'POST',
            handler: (request, headers) => {
                const payload = request.payload
                return this.db.create(payload)
            }
            
        }
    }
    update() {
        return {
            path: '/endereco/{id}',
            method: 'PATCH',
            handler: (request, headers) => {
                const payload = request.payload;
                const id = request.params.id;
                return this.db.update(id, payload)
            }
        }
    }
    delete() {
        return {
            path: '/endereco/{id}',
            method: 'DELETE',
            handler: (request, headers) => {
                const id = request.params.id;
                return this.db.delete(id)
            }
        }
    }

}

module.exports = EnderecoRoute