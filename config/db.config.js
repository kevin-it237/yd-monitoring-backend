const localDB = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "",
  DB: "yd_test_db",
  dialect: "mysql",
  operatorsAliases: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
};

const liveDemoDB = {
  HOST: "bozohhrehk0tqyy0yy7y-mysql.services.clever-cloud.com",
  USER: "ukvlpqhtnaxyccpt",
  PASSWORD: "g3SeZvuS8eYFW05v0kpQ",
  DB: "bozohhrehk0tqyy0yy7y",
  dialect: "mysql",
  operatorsAliases: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
}

const liveMainDB = {
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

module.exports = process.env.NODE_ENV !== 'production' ? localDB : liveMainDB