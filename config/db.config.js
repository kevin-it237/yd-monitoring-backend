const localDB = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "",
  DB: "civil-aviation-db",
  dialect: "mysql",
  operatorsAliases: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
};

const liveDB = {
  HOST: "bkfhoebpbmibyzpp2wgz-mysql.services.clever-cloud.com",
  USER: "ufmiboyv7gmdptp9",
  PASSWORD: "Ej9v7rHDReadu8SR3qDA",
  DB: "bkfhoebpbmibyzpp2wgz",
  dialect: "mysql",
  operatorsAliases: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
}

module.exports = process.env.NODE_ENV !== 'production' ? localDB : liveDB