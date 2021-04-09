const Sequelize = require("sequelize");
const db = require('./index')

const Level = require('./Level')

const Organisation = db.sequelize.define("organisation", {
    YDMS_Org_id: {
        type: Sequelize.STRING,
        primaryKey: true,
    },
    short_name: {
        type: Sequelize.STRING
    },
    full_name: {
        type: Sequelize.STRING
    }
});

Level.hasOne(Organisation); 
Organisation.belongsTo(Level); 


module.exports = Organisation