var router = require("express").Router();
const SPResponse = require('../models/SP_Response')
const SurveyProtocol = require('../models/SurveyProtocol')
const Organisation = require('../models/Organisation')
const { authJwt } = require("../middleware");

// Save question response
router.post("/", authJwt.verifyToken, (req, res, next) => {
    if (!req.body.YDMS_Org_id) {
        return res.status(400).send({
            message: "YDMS_Org_id field not found!"
        });
    }

    if(!req.body.YDMS_SP_id) {
        return res.status(400).send({
            message: "YDMS_SP_id field not found!"
        });
    }
    if(!req.body.response.toString().length) {
        return res.status(400).send({
            message: "response field not found!"
        });
    }

    const response = {
        organisationYDMSOrgId: req.body.YDMS_Org_id,
        surveyProtocolYDMSSPId: req.body.YDMS_SP_id,
        questionnaire_response: req.body.response,
        weight_response: req.body.weight ? parseFloat(req.body.weight || "1") : 0,
        // weight_response: 0,
        kpi_id: req.body.kpi
    }

    // Check if question is already anwsered
    SPResponse.findOne({
        where: {
            organisationYDMSOrgId: req.body.YDMS_Org_id,
            surveyProtocolYDMSSPId: req.body.YDMS_SP_id
        }
    }).then(question => {
        if (question) {
            // Update the response
            question.update({
                questionnaire_response: req.body.response,
            })
            .then(response => {
                return res.status(200).send({ 
                    success: true,
                    data: response,
                    message: "Response updated successfully!" });
            })
            .catch(err => {
                return res.status(500).send({ success: false, message: err.message });
            });
        } else {
            // Save the response
            SPResponse.create(response)
            .then(response => {
                return res.status(200).send({ 
                    success: true,
                    data: response,
                    message: "Response saved successfully!" });
            })
            .catch(err => {
                return res.status(500).send({ success: false, message: err.message });
            });
        }
    });
});

// Bulk Save question response
router.post("/bulk", authJwt.verifyToken, async(req, res, next) => {
    let responses = req.body.responses;
    if(!responses) {
        return res.status(400).send({
            message: "Response array not found"
        });
    }

    const responsesToSave = [];
    let _error = null; // captures first batch error

    responses.forEach(response => {
        if (!response.YDMS_Org_id) {
            return res.status(400).send({
                message: "YDMS_Org_id field not found!"
            });
        }
        if (!response.YDMS_Org_id) {
            return res.status(400).send({
                message: "YDMS_Org_id field not found!"
            });
        }
    
        if(!response.YDMS_SP_id) {
            return res.status(400).send({
                message: "YDMS_SP_id field not found!"
            });
        }
        if(!response.response.toString().length) {
            return res.status(400).send({
                message: "response field not found!"
            });
        }

        responsesToSave.push({
            organisationYDMSOrgId: response.YDMS_Org_id,
            surveyProtocolYDMSSPId: response.YDMS_SP_id,
            questionnaire_response: response.response,
            weight_response: response.weight ? parseFloat(response.weight || "1") : 0,
            kpi_id: response.kpi
        })
    });

    const saveResponseItem = async (_response) => {
        const responseExist = await SPResponse.findOne({
            where: {
                organisationYDMSOrgId: _response.organisationYDMSOrgId,
                surveyProtocolYDMSSPId: _response.surveyProtocolYDMSSPId
            }
        });

        if (responseExist) {
            await responseExist.update({
                questionnaire_response: _response.questionnaire_response,
            });
        } else {
            await SPResponse.create(_response);
        }
    };

    // Process in batches matching the DB connection pool size to avoid exhausting connections
    const BATCH_SIZE = 5;
    try {
        for (let i = 0; i < responsesToSave.length; i += BATCH_SIZE) {
            const batch = responsesToSave.slice(i, i + BATCH_SIZE);
            await Promise.all(batch.map(saveResponseItem));
        }
    } catch (error) {
        _error = error.message;
    }

    if(_error) {
        return res.status(500).send({ success: false, message: _error });
    } else {
        return res.status(201).send({ 
            success: true,
            data: {},
            message: "Responses updated successfully!" 
        });
    }
});


// Questions anwsered by an org
router.get("/:orgId", authJwt.verifyToken, (req, res, next) => {

    const orgId = req.params.orgId
    
    SPResponse.findAll({
        where: {
            organisationYDMSOrgId: orgId
        }
    }).then(responses => {
        return res.status(201).send(responses);
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });
});

// Questions and responses by an org
router.get("/questions/:orgId", authJwt.verifyToken, (req, res, next) => {

    const orgId = req.params.orgId
    
    Organisation.findOne({
        attributes: ['YDMS_Org_id', 'short_name'],
        where: {
            YDMS_Org_id: orgId
        },
        include: [
            {
                model: SurveyProtocol,
                attributes: ['YDMS_SP_id', 'ydmsKpiYDMSKPIsId', 'questionnaire_text', 'YDMS_Inst_id', 'provision_id', 'weight'],
            }
        ],
    }).then(responses => {
        return res.status(201).send(responses);
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });
});

module.exports = router;