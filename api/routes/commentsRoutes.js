var router = require("express").Router();
const Comment = require('../models/Comment')
const { authJwt } = require("../middleware");

// Save question response
router.post("/", authJwt.verifyToken, (req, res, next) => {
    if (!req.body.user) {
        return res.status(401).send({
            message: "user field not found!"
        });
    }

    if(!req.body.date) {
        return res.status(401).send({
            message: "Date field not found!"
        });
    }
    if(!req.body.comment.toString().length) {
        return res.status(401).send({
            message: "Comment field not found!"
        });
    }

    const newComment = {
        user: req.body.user,
        comment: req.body.comment,
        date: req.body.date
    }

    Comment.create(newComment)
    .then(response => {
        res.status(200).send({ 
            data: response,
            message: "Comment saved successfully!" });
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });
});

// Get all comments
router.get("/", authJwt.verifyToken, (req, res, next) => {
    
    Comment.findAll()
    .then(responses => {
        return res.status(201).send(responses);
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });
});

module.exports = router;