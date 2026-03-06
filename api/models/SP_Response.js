const Sequelize = require("sequelize");
const db = require('./index')

const Organisation = require('./Organisation')
const SurveyProtocol = require('./SurveyProtocol')

const SPResponse = db.sequelize.define("sp_response", {
    questionnaire_response: {
        type: Sequelize.BOOLEAN
    },
    weight_response: {
        type: Sequelize.FLOAT
    },
    kpi_id: {
        type: Sequelize.STRING
    }
}, {
    indexes: [
        { name: 'idx_sp_response_org_sp', fields: ['organisationYDMSOrgId', 'surveyProtocolYDMSSPId'] },
        { name: 'idx_sp_response_org', fields: ['organisationYDMSOrgId'] },
        { name: 'idx_sp_response_kpi', fields: ['kpi_id'] },
    ]
});
 
Organisation.belongsToMany(SurveyProtocol, { through: SPResponse });
SurveyProtocol.belongsToMany(Organisation, { through: SPResponse });

module.exports = SPResponse 