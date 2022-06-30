var router = require("express").Router();
const db = require('../models')
const { QueryTypes } = db.Sequelize;
const { authJwt } = require("../middleware");
const Op = db.Sequelize.Op

const SurveyProtocol = require('../models/SurveyProtocol')
const Organisation = require('../models/Organisation')

// KPIs data summary
router.get("/state", authJwt.verifyToken, (req, res, next) => {
    let orgId = req.headers.orgid
    const role = req.role

    Organisation.findOne({
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
});

module.exports = router;