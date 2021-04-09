const Sequelize = require("sequelize");
const db = require('./index')

const YDMS_KPIs = require('../models/YDMS_KPIs')
const Provision = require('../models/Provision')

const SurveyProtocol = db.sequelize.define("survey_protocol", {
    YDMS_SP_id: {
        type: Sequelize.STRING,
        primaryKey: true,
    },
    questionnaire_label: {
        type: Sequelize.STRING
    },
    questionnaire_text: {
        type: Sequelize.TEXT
    },
    weight: {
        type: Sequelize.INTEGER
    },
    SP_checklist_id: {
        type: Sequelize.STRING
    },
    YDMS_Inst_id: {
        type: Sequelize.STRING
    },
    provision_id: {
        type: Sequelize.STRING
    },
});

YDMS_KPIs.hasMany(SurveyProtocol);
SurveyProtocol.belongsTo(YDMS_KPIs);

// Provision.hasOne(SurveyProtocol, {foreignKey: 'provision_id'});
// SurveyProtocol.belongsTo(Provision, {foreignKey: 'provision_id'});

module.exports = SurveyProtocol