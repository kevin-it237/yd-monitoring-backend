var router = require("express").Router();
const Definition = require('../models/Definition')
const Article = require('../models/Article')
const Provision = require('../models/Provision');
const Instrument = require("../models/Instrument");
const db = require('../models')
const Op = db.Sequelize.Op
const { authJwt } = require("../middleware");

// Get all definitions
router.get("/definitions", authJwt.verifyToken, (req, res, next) => {
    Definition.findAll()
    .then(data => {
        res.status(200).send(data);
    })
    .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving definitions."
        });
    });
});

// Get all instruments, articles, and provision
router.get("/instruments", authJwt.verifyToken, (req, res, next) => {
    Instrument.findAll({
        include: [
            {
                model: Article,
                where: {},
                include: [
                    {
                        model: Provision,
                        where: {}
                    },
                ]
            },
        ],
    })
    .then(data => {
        res.status(200).send(data);
    })
    .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving definitions."
        });
    });
});

// Get all instruments, articles, and provision
router.get("/provision/:instId/:provision_id", authJwt.verifyToken, (req, res, next) => {
    const provision_id = req.params.provisionNumber
    const instId = req.params.instId
    
    Provision.findOne({
        where: {
            provision_id: {
                [Op.eq]: provision_id
            }
        },
        include: [
            {
                model: Article,
                include: [
                    {
                        model: Instrument,
                        where: {
                            YDMS_Inst_id: {
                                [Op.eq]: instId
                            }
                        }
                    }
                ]
            },
        ],
    })
    .then(data => {
        res.status(200).send(data);
    })
    .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving definitions."
        });
    });
});

module.exports = router;