/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
import { MongoClient } from 'mongodb';

export default class Mongo {
  /**
   * @type {string}
   */
  name = 'mongo';

  /**
   * @type {Application}
   */
  app;

  /**
   * @type {object}
   */
  config;

  /**
   * @type {string}
   */
  defaultHost = 'localhost';

  /**
   * @type {number}
   */
  defaultPort = 27017;

  /**
   * @type {string}
   */
  defaultUser;

  /**
   * @type {string}
   */
  defaultPassword;

  /**
  * @type {import('mongodb').MongoClientOptions}
  */
  defaultMongoClientOptions = {};

  /**
   * @type {Object.<string, MongoClient>}
   */
  clients = {};

  /**
   * @type {Object.<string, Db>}
   */
  dbs = {};

  constructor(app) {
    this.app = app;
  }

  async start() {
    this.config = this.app.config.mongo || null;

    if (!this.config) {
      this.app.logger.info('Нет конфигурации для mongo. Инициализация компонента пропущена');
      return;
    }

    if ('host' in this.config) {
      this.defaultHost = this.config.host;
    }

    if ('port' in this.config) {
      this.defaultPort = this.config.port;
    }

    if ('user' in this.config) {
      this.defaultUser = this.config.user;
    }

    if ('password' in this.config) {
      this.defaultPassword = this.config.password;
    }

    if ('mongoClientOptions' in this.config) {
      this.defaultMongoClientOptions = this.config.mongoClientOptions;
    }

    if ('database' in this.config) {
      const client = this.#getClient({ database: this.config.database });
      this.clients.default = client;
      this.dbs.default = await this.#connectDb(client, this.config.database);
    } else {
      await Promise.all(Object.keys(this.config).map(async (key) => {
        if (this.config[key] && typeof this.config[key] === 'object' && 'database' in this.config[key]) {
          const client = this.#getClient(this.config[key]);
          this.clients[key] = client;
          this.dbs[key] = await this.#connectDb(client, this.config[key].database);
        }
      }));
    }
    this.app.mongo = Object.keys(this.dbs).length === 1 ? this.dbs[0] : this.dbs;
  }

  #getClient(config) {
    const {
      host,
      port,
      user,
      password,
      database,
      mongoClientOptions
    } = config;
    const auth = {
      username: user || this.defaultUser,
      password: password || this.defaultPassword
    };
    const options = { ...mongoClientOptions || this.defaultMongoClientOptions, auth };
    const url = config.url ?? `mongodb://${host || this.defaultHost}:${port || this.defaultPort}/${database}`;
    return new MongoClient(url, options);
  }

  async #connectDb(client, database) {
    try {
      await client.connect();
      const db = client.db(database);
      this.app.logger.debug(`База данных ${database} подключена`);
      return db;
    } catch (error) {
      this.app.logger.error(`Не удалось подключиться к базе данных ${database}`);
      throw error;
    }
  }

  async stop() {
    await Promise.all(Object.values(this.clients).map(async (client) => {
      await client.close();
    }));
  }
}
