var router = require("express").Router();
const Organisations = require('../models/Organisation')
const { authJwt } = require("../middleware");

// Get all organisations
router.get("/", authJwt.verifyToken, (req, res, next) => {
    Organisations.findAll()
    .then(data => {
        res.status(200).send(data);
    })
    .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Survey Organisations."
        });
    });
});


module.exports = router;