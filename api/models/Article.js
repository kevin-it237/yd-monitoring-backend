const Sequelize = require("sequelize");
const db = require('./index')

const Provision = require('./Provision')

const Article = db.sequelize.define("article", {
    YDMS_Art_id: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    article_chapter: {
        type: Sequelize.STRING
    },
    article_title: {
        type: Sequelize.STRING
    },
    article_number: {
        type: Sequelize.STRING
    },
    article_part: {
        type: Sequelize.STRING
    }
}); 

Article.hasMany(Provision, {foreignKey: 'YDMS_Art_id'});
Provision.belongsTo(Article, {foreignKey: 'YDMS_Art_id'});

module.exports = Article