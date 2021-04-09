var router = require("express").Router();
const State = require('../models/State')
const { authJwt } = require("../middleware");

// Get all states
router.get("/", authJwt.verifyToken, (req, res, next) => {
    State.getAllStates()
    .then(data => {
        res.status(200).send(data);
    })
    .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving states."
        });
    });
});


module.exports = router;