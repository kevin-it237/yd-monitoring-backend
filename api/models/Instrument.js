const Sequelize = require("sequelize");
const db = require('./index')

const Definition = require('./Definition')
const Article = require('./Article')

const Instrument = db.sequelize.define("instrument", {
    YDMS_Inst_id: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    instrument_name: {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.TEXT
    }
}); 

Instrument.hasMany(Definition, {foreignKey: 'YDMS_Inst_id'});
Definition.belongsTo(Instrument, {foreignKey: 'YDMS_Inst_id'});

Instrument.hasMany(Article, {foreignKey: 'YDMS_Inst_id'});
Article.belongsTo(Instrument, {foreignKey: 'YDMS_Inst_id'});

module.exports = Instrument