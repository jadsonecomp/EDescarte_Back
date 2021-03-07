const IDb = require('../base/interfaceDb');
const Sequelize = require('sequelize');
 
class PostgreSQLStrategy extends IDb {

  constructor(connection, schema) {
    super();
    this._db = schema;
    this._connection = connection;

  }
  
  static async defineModel(connection, schema) {
    const model = connection.define(
      schema.name, schema.schema, schema.options,
    );
    await model.sync()
    return model
  }

  static async connect() {
    const ambiente = process.env.SSL_DB
    
    if (ambiente === 'false') { //Ambiente de desenvolvimento
      const sequelize  = new Sequelize(
        // 'edescarte', //database
        // 'admin', // user
        // 'root', //senha
        process.env.POSTGRES_URL,
        {
          // host: 'localhost',
          // dialect: 'postgres',
          // case sensitive
          quoteIdentifiers: false,
          // deprecation warning
          operatorsAliases: false,
          //disable logging
          logging: false
          // dialectOptions: {
          //   ssl: true,
        },
      );

      return sequelize
    }else{    //Ambiente Produção
      const sequelize  = new Sequelize(
        process.env.POSTGRES_URL,
        {
          // case sensitive
          quoteIdentifiers: false,
          // deprecation warning
          operatorsAliases: false,
          //disable logging
          logging: false,
          dialectOptions: {
            ssl: {
              require: process.env.SSL_DB,
              rejectUnauthorized: process.env.SSL_DBF // <<<<<<< YOU NEED THIS
            }
          }
        },
      );

      return sequelize
    }
    
  }

  async isConnected() {
    try {
      // await this._connect();
      await this._connection.authenticate();
      return true;
    } catch (error) {
      console.error('fail!', error);
      return false;
    }
  }

  async closeConnection() {
    try {
      // await this._connect();
      await this._connection.close();
      return true;
    } catch (error) {
      console.error('fail!', error);
      return false;
    }
  }


  create(item) {
    return this._db.create(item, {
      raw: true
    });
  }

  read(item, modelPk = '') {
    return this._db.findAll({
      where: item,
      raw: true
      });     
  }

  update(id, item) {
    return this._db.update(item, {
      where: {
        id
      }
    });
  }
  
  delete(id) {
    const query = id ? {
      id
    } : {};
    return this._db.destroy({
      where: query
    });
  }
}

module.exports = PostgreSQLStrategy;