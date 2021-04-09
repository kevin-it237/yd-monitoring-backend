var router = require("express").Router();
const User = require('../models/User')
const { authJwt } = require("../middleware");

// Get all states
router.get("/", authJwt.verifyToken, (req, res, next) => {
    User.findAll()
    .then(data => {
        res.status(200).send(data);
    })
    .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving users."
        });
    });
});


module.exports = router;