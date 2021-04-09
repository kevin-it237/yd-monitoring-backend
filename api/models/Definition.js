const Sequelize = require("sequelize");
const db = require('./index')


const Definition = db.sequelize.define("definition", {
    YDMS_Def_id: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    term: {
        type: Sequelize.STRING
    },
    definition: {
        type: Sequelize.TEXT
    }
}); 

module.exports = Definition