const express = require('express')
const router = express.Router()
const Multer = require('multer');
const {Storage} = require('@google-cloud/storage');
const uploadImageToStorage = require('../helpers/uploadImageToStorage');
const Document = require('./../models/Documents')
const { authJwt } = require("../middleware");

const storage = new Storage({
    projectId: "yd-monitoring-system",
    keyFilename: "./serviceAccountKey.json"
});
  
const bucket = storage.bucket("yd-monitoring-system.appspot.com");

const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024 // no larger than 0.5mb, you can change as needed.
    }
});

// Survey creation
router.post('/', authJwt.verifyToken, multer.any(), (req, res, next) => {
    var promises = [];

    const title = req.body.title;
    const description = req.body.description;
    const orgId = req.body.orgid;

    if(!title) {
        return res.status(400).send({
            success: false,
            message: 'Title is required'
        })
    }

    if(!req.files) {
        return res.status(400).send({
            success: false,
            message: 'Files are required'
        })
    }

    req.files.forEach(function(file) {
        promises.push(
            uploadImageToStorage(file, bucket)
            .then((url) => {
                return url;
            }).catch((error) => {
                console.error(error);
            })
        );
    });

    //Upload all images. Failed if one image failed uploading
    Promise.all(promises).then(function(files) {
        const filelists =  files.join(',');

        const document = {
            title: title,
            description: description,
            orgId: orgId,
            files: filelists
        }
        Document.create(document)
        .then(doc => {
            res.status(201).json({
                success: true,
                message: 'Document uploaded successfully',
                data: doc
            });
        })
        .catch(err => {
            console.log({err})
            res.status(500).json({ error: err })
        })
    });

})

// Get documents by states
router.get("/states/:orgId", authJwt.verifyToken, (req, res, next) => {
    Document.findAll({
        where: {
            orgId: req.params.orgId
        }
    })
    .then(data => {
        res.status(200).send({
            success: true,
            data: data
        });
    })
    .catch(err => {
        res.status(500).send({
          message:
            err.message
        });
    });
});

module.exports = router;