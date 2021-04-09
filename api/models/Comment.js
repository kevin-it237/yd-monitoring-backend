const Sequelize = require("sequelize");
const db = require('./index')


const Comment = db.sequelize.define("comment", {
    user: {
        type: Sequelize.STRING
    },
    comment: {
        type: Sequelize.TEXT
    },
    date: {
        type: Sequelize.STRING
    }
}); 


module.exports = Comment