var router = require("express").Router();
const db = require('../models')
const { QueryTypes } = db.Sequelize;
const { authJwt } = require("../middleware");
const Op = db.Sequelize.Op

const SurveyProtocol = require('../models/SurveyProtocol')
const Organisation = require('../models/Organisation')
const YDMS_KPIs = require('../models/YDMS_KPIs')
const SP_Response = require('../models/SP_Response')
const State = require('../models/State')

// Get a single KPI data
router.get("/:kpiId", authJwt.verifyToken, (req, res, next) => {
    let kpiId = req.params.kpiId
    let orgId = req.headers.orgid
    const role = req.role

    // For admin
    let query = 'SELECT states.country_code, organisations.short_name, organisations.YDMS_Org_id, SUM(survey_protocols.weight) as totalweight, SUM(sp_responses.weight_response) as custom_weight, SUM(sp_responses.questionnaire_response) as response, SUM((CASE WHEN sp_responses.questionnaire_response > 0 THEN survey_protocols.weight ELSE 0 END)) as weight, COUNT(*) as totalSP FROM `survey_protocols`, `organisations`, `sp_responses`, `states` WHERE survey_protocols.ydmsKpiYDMSKPIsId=? AND sp_responses.organisationYDMSOrgId=organisations.YDMS_Org_id AND states.YDMS_AU_id=organisations.YDMS_Org_id AND sp_responses.surveyProtocolYDMSSPId=survey_protocols.YDMS_SP_id GROUP BY organisations.YDMS_Org_id'
    
    // For state user || just add this: organisations.YDMS_Org_id=?
    if(role !== 'admin') {
        query = 'SELECT states.country_code, organisations.short_name, organisations.YDMS_Org_id, SUM(survey_protocols.weight) as totalweight, SUM(sp_responses.weight_response) as custom_weight, SUM(sp_responses.questionnaire_response) as response, SUM((CASE WHEN sp_responses.questionnaire_response > 0 THEN survey_protocols.weight ELSE 0 END)) as weight, COUNT(*) as totalSP FROM `survey_protocols`, `organisations`, `sp_responses`, `states` WHERE survey_protocols.ydmsKpiYDMSKPIsId=? AND sp_responses.organisationYDMSOrgId=organisations.YDMS_Org_id AND states.YDMS_AU_id=organisations.YDMS_Org_id AND organisations.YDMS_Org_id=? AND sp_responses.surveyProtocolYDMSSPId=survey_protocols.YDMS_SP_id GROUP BY organisations.YDMS_Org_id'
    }

    if(kpiId === 'kpi_5') kpiId = 'kpi_4'
    
    if(kpiId === 'kpi_4') {
        query = 'SELECT survey_protocols.questionnaire_text, states.country_code, organisations.short_name, organisations.YDMS_Org_id, sp_responses.weight_response, sp_responses.questionnaire_response FROM `survey_protocols`, `organisations`, `sp_responses`, `states` WHERE survey_protocols.ydmsKpiYDMSKPIsId=? AND sp_responses.organisationYDMSOrgId=organisations.YDMS_Org_id AND states.YDMS_AU_id=organisations.YDMS_Org_id AND sp_responses.surveyProtocolYDMSSPId=survey_protocols.YDMS_SP_id'
        // For state || just add this: organisations.YDMS_Org_id=?
        if(role !== 'admin') {
            query = 'SELECT survey_protocols.questionnaire_text, states.country_code, organisations.short_name, organisations.YDMS_Org_id, sp_responses.weight_response, sp_responses.questionnaire_response FROM `survey_protocols`, `organisations`, `sp_responses`, `states` WHERE survey_protocols.ydmsKpiYDMSKPIsId=? AND sp_responses.organisationYDMSOrgId=organisations.YDMS_Org_id AND states.YDMS_AU_id=organisations.YDMS_Org_id AND sp_responses.surveyProtocolYDMSSPId=survey_protocols.YDMS_SP_id AND organisations.YDMS_Org_id=?'
        }
    }

    const queryPromise = 
    db.sequelize.query(query,
        {
            replacements: role !== 'admin' ? [kpiId, orgId] : [kpiId],
            type: QueryTypes.SELECT
        }
    );

    queryPromise
    .then(data => {
        res.status(200).send(data);
    })
    .catch(err => {
        res.status(500).send({
        message:
            err.message || "Some error occurred while retrieving KPIs datas."
        });
    });
});

// Get a single KPI data for Afcac
router.get("/afcac/:kpiId", authJwt.verifyToken, (req, res, next) => {
    const kpiId = req.params.kpiId

    const queryPromise = 
    db.sequelize.query(
        'SELECT organisations.short_name, organisations.YDMS_Org_id, sp_responses.questionnaire_response, survey_protocols.questionnaire_text, survey_protocols.weight FROM `survey_protocols`, `organisations`, `sp_responses` WHERE survey_protocols.ydmsKpiYDMSKPIsId=? AND sp_responses.organisationYDMSOrgId=organisations.YDMS_Org_id AND sp_responses.surveyProtocolYDMSSPId=survey_protocols.YDMS_SP_id',
        {
          replacements: [kpiId],
          type: QueryTypes.SELECT
        }
    );

    queryPromise
    .then(data => {
        res.status(200).send(data);
    })
    .catch(err => {
        res.status(500).send({
        message:
            err.message || "Some error occurred while retrieving KPIs datas."
        });
    });
});

// KPIs data summary
router.get("/summary/:orgType", authJwt.verifyToken, (req, res, next) => {
    const orgType = req.params.orgType
    let orgId = req.headers.orgid
    const role = req.role

    if(orgType === 'afcac') {
        let query = 'SELECT ydms_kpis.YDMS_KPIs_id, ydms_kpis.KPIs_label, SUM(survey_protocols.weight) as totalweight, SUM(sp_responses.weight_response) as custom_weight, SUM(sp_responses.questionnaire_response) as response, SUM((CASE WHEN sp_responses.questionnaire_response > 0 THEN survey_protocols.weight ELSE 0 END)) as weight, COUNT(*) as totalSP FROM `survey_protocols`, `ydms_kpis`, `sp_responses` WHERE survey_protocols.ydmsKpiYDMSKPIsId=ydms_kpis.YDMS_KPIs_id AND survey_protocols.YDMS_SP_Id=sp_responses.surveyProtocolYDMSSPId AND ydms_kpis.KPIs_org_type=? GROUP BY survey_protocols.ydmsKpiYDMSKPIsId'
        
        const queryPromise = db.sequelize.query(query,
            {
              replacements: [orgType],
              type: QueryTypes.SELECT
            }
        );
        queryPromise
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while retrieving datas"
            });
        });
    } else if(orgType === 'state') {
            Organisation.findAll({ 
            // attributes: ['YDMS_SP_id', 'ydmsKpiYDMSKPIsId'],
            where: role === 'state'? {
                YDMS_Org_id: {
                    [Op.eq]: orgId
                }
            }: {},
            include: [
                {
                    model: SurveyProtocol,
                    where: {
                        // ydmsKpiYDMSKPIsId: {
                        //     [Op.eq]: kpiId
                        // }
                    }
                }
            ],
        })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving state datas."
            });
        });
    }
});

// KPIs listing
router.get("/org/:type", authJwt.verifyToken, (req, res, next) => {
    const type = req.params.type

    YDMS_KPIs.findAll({ 
        where: {
            KPIs_org_type: {
                [Op.eq]: type
            }
        },
        order: [
            ['YDMS_KPIs_id', 'ASC'],
        ],
    })
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving datas"
        });
    });
});

module.exports = router;