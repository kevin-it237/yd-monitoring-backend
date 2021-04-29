const Sequelize = require("sequelize");
const db = require('../models')
const sequelize = db.sequelize

const Address = require('./Address');

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
    focal_person: {
        type: Sequelize.STRING
    },
    caa_name: {
        type: Sequelize.STRING
    },
    head_quarter: {
        type: Sequelize.STRING
    },
    focal_person_email: {
        type: Sequelize.STRING
    },
}, 
{ sequelize,
    modelName: 'states' });

State.belongsTo(Address, {foreignKey: 'CAA_address'})
Address.hasOne(State, {foreignKey: 'CAA_address'});

module.exports = State