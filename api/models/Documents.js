const Sequelize = require("sequelize");
const db = require('./index')

const Document = db.sequelize.define("document", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.TEXT
    },
    files: {
        type: Sequelize.TEXT
    },
    orgId: {
        type: Sequelize.INTEGER
    }
});

module.exports = Document