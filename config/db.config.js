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

const liveDB = {
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

module.exports = process.env.NODE_ENV !== 'production' ? localDB : liveDB