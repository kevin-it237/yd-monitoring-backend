var router = require("express").Router();
const SurveyProtocol = require('../models/SurveyProtocol')
const { authJwt } = require("../middleware");

// Get all survey Protocols
router.get("/", authJwt.verifyToken, (req, res, next) => {
    SurveyProtocol.findAll()
    .then(data => {
        res.status(200).send(data);
    })
    .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Survey Protocols."
        });
    });
});


module.exports = router;