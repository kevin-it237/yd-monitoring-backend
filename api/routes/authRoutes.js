var router = require("express").Router();
const { verifySignUp } = require("../middleware");
const User = require('../models/User')
const Sequelize = require('sequelize')
const config = require('../../config/auth.config')
const { authJwt } = require("../middleware");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

router.post("/register", verifySignUp.checkDuplicateUsernameOrEmail, (req, res) => {
    // Save User to Database
    User.create({
        username: req.body.username,
        email: req.body.email,
        role: req.body.role,
        short_name: req.body.short_name,
        password: bcrypt.hashSync(req.body.password, 8),
        orgId: req.body.orgId
    })
    .then(user => {
        res.status(200).send({ 
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            short_name: user.short_name,
            orgId: user.orgId,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            message: "User was registered successfully!" });
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });
});

router.post("/signin", (req, res) => {
    User.findOne({
        where: {
            username: req.body.username
        }
    })
    .then(user => {
        if (!user) {
            return res.status(404).send({ message: "User Not found." });
        }

        var passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );

        if (!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: "Invalid Password!"
            });
        }

        var token = jwt.sign({ id: user.id, role: user.role }, config.secret, {
            expiresIn: 86400*365 // one year
        });

        res.status(200).send({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            short_name: user.short_name,
            orgId: user.orgId,
            accessToken: token,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });
});

router.put("/users", authJwt.verifyToken, (req, res) => {
    // Update User to Database
    User.update(
        { password: bcrypt.hashSync(req.body.password, 8) }, 
        {  where : { username: req.body.username }}
    )
    .then(user => {
        res.status(200).send({ 
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            short_name: user.short_name,
            orgId: user.orgId,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            message: "User was successfully updated!" });
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });
});

module.exports = router;