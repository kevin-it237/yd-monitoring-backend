const Sequelize = require("sequelize");
const db = require('../models')
const sequelize = db.sequelize

class State extends Sequelize.Model {

    static getAllStates() {
      return State.findAll({
        order: [
            ['short_name', 'ASC']
        ],
      })
    }

    getFullname() {
      return [this.firstname, this.lastname].join(' ');
    }
}

State.init({
    YDMS_AU_id: {
        type: Sequelize.STRING,
        primaryKey: true,
    },
    country_code: {
        type: Sequelize.STRING
    },
    YD_membership: {
        type: Sequelize.BOOLEAN
    },
    SAATM_membership: {
        type: Sequelize.BOOLEAN
    },
    short_name: {
        type: Sequelize.STRING
    },
    full_name: {
        type: Sequelize.STRING
    },
    ICAO_code: {
        type: Sequelize.STRING
    },
}, 
{ sequelize,
    modelName: 'states' });

module.exports = State