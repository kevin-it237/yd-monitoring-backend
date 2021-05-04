const Sequelize = require("sequelize");
const db = require('./index')

const Address = db.sequelize.define("address", {
    address_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    city: {
        type: Sequelize.STRING
    },
    address_line: {
        type: Sequelize.STRING
    },
    web_address: {
        type: Sequelize.STRING
    },
    zip_code: {
        type: Sequelize.STRING
    }
});

module.exports = Address