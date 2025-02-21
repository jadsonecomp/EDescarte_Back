const IDb = require('./interfaceDb');

class ContextStrategy extends IDb {
  constructor(database) {
    super();
    this._database = database;
  }
  isConnected() {
    return this._database.isConnected();
  }
  closeConnection() {
    return this._database.closeConnection();
  }
  connect() {
    return this._database.connect()
  }
  create(item) {
    return this._database.create(item);
  }

  bulkCreate(item) {
    return this._database.bulkCreate(item);
  }

  read(item) {
    return this._database.read(item);
  }

  update(id, item) {
    return this._database.update(id, item);
  }
  delete(id) {
    return this._database.delete(id);
  }
}

module.exports = ContextStrategy;
