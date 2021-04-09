const Sequelize = require("sequelize");
const db = require('./index')


const Provision = db.sequelize.define("provision", {
    provision_id: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    YDMS_Inst_id: {
        type: Sequelize.STRING
    },
    provision_number: {
        type: Sequelize.STRING
    },
    text_content: {
        type: Sequelize.TEXT
    }
}); 

module.exports = Provision