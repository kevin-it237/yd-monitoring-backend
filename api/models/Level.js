const Sequelize = require("sequelize");
const db = require('./index')


const Level = db.sequelize.define("level", {
    level_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    level_label: {
        type: Sequelize.STRING
    }
}); 

module.exports = Level