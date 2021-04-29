var router = require("express").Router();
const State = require('../models/State')
const Address = require('../models/Address')
const { authJwt } = require("../middleware");

// Get all states
router.get("/", authJwt.verifyToken, (req, res, next) => {
    State.getAllStates({
        include: [
            {
                model: Address,
            },
        ],
    })
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

// Update state
router.put("/:id", authJwt.verifyToken, (req, res, next) => {

    const stateId = req.params.id;
    const SAATM_membership = req.body.SAATM_membership

    State.findOne({
        where: {
            YDMS_AU_id: stateId
        }
    }).then(state => {
        if (state) {
            // Update the response
            state.update({
                SAATM_membership: SAATM_membership,
            })
            .then(response => {
                return res.status(200).send({ 
                    success: true,
                    data: response,
                    message: "SAATM_membership updated successfully!" });
            })
            .catch(err => {
                return res.status(500).send({ success: false, message: err.message });
            });
        } else {
            return res.status(404).send({ success: false, message: 'State not found' });
        }
    });

    
});


module.exports = router;