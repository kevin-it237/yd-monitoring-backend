const Sequelize = require("sequelize");
const db = require('../models')

const User = db.sequelize.define("user", {
    username: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    },
    orgId: {
        type: Sequelize.STRING
    },
    short_name: {
        type: Sequelize.STRING
    },
    role: {
        type: Sequelize.STRING
    },
    createdAt: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.NOW,
        field: 'created_at'
    },
    updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        onUpdate: Sequelize.NOW,
        field: 'updated_at'
    },
});

module.exports = User