var router = require("express").Router();
const crypto = require('crypto');
const { verifySignUp } = require("../middleware");
const User = require('../models/User')
const State = require('../models/State')
const Address = require('../models/Address')
const Sequelize = require('sequelize')
const config = require('../../config/auth.config')
const { authJwt } = require("../middleware");
const sendMail = require('../helpers/sendmail')

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

/**
 * Generate a secure random password
 * @param {number} length - Password length (default: 12)
 * @returns {string} - Random password
 */
function generateSecurePassword(length = 12) {
    const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const lowercase = 'abcdefghjkmnpqrstuvwxyz';
    const numbers = '23456789';
    const symbols = '!@#$%&*';
    const allChars = uppercase + lowercase + numbers + symbols;

    let password = '';
    // Ensure at least one of each type
    password += uppercase[crypto.randomInt(uppercase.length)];
    password += lowercase[crypto.randomInt(lowercase.length)];
    password += numbers[crypto.randomInt(numbers.length)];
    password += symbols[crypto.randomInt(symbols.length)];

    // Fill the rest randomly
    for (let i = password.length; i < length; i++) {
        password += allChars[crypto.randomInt(allChars.length)];
    }

    // Shuffle the password
    return password.split('').sort(() => crypto.randomInt(3) - 1).join('');
}

router.post("/register", verifySignUp.checkDuplicateUsernameOrEmail, (req, res) => {
    // Generate secure random password on the server
    const generatedPassword = generateSecurePassword(12);

    // Save User to Database
    User.create({
        org_code: req.body.org_code,
        email: req.body.email,
        position: req.body.position,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        role: req.body.role,
        short_name: req.body.short_name,
        password: bcrypt.hashSync(generatedPassword, 8),
        orgId: req.body.orgId
    })
    .then(user => {
        sendMail(
            'You are registered to the YD Monitoring System',
            user.email,
            `<h4>You are successfully registered to the YD Monitoring system</h4>
            <p>Your password is: <b>${generatedPassword}</b></p>
            <p>Use your email and this password to login.</p>
            <p>We recommend changing your password after your first login.</p>`,
            (err, info) => {
                console.log(err);
            }
        )
        res.status(201).send({
            id: user.id,
            orgId: user.orgId,
            message: "User was registered successfully!" });
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });
});

router.post("/signin", (req, res) => {
    User.findOne({
        where: {
            email: req.body.email
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
            expiresIn: 86400*1 // 24 hours
        });

        const loggedUser = {
            id: user.id,
            org_code: user.org_code,
            email: user.email,
            role: user.role,
            short_name: user.short_name,
            orgId: user.orgId,
            position: user.position,
            first_name: user.first_name,
            last_name: user.last_name,
            accessToken: token,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }

        if(user.role === 'state') {
            State.findOne({
                where: {
                    YDMS_AU_id: user.orgId
                },
                include: [
                    {
                        model: Address,
                    },
                ],
            }).then(state => {
                // Send email to focal person
                if(state.focal_person_email) {
                    sendMail(
                        '<User Login Notification>',
                        state.focal_person_email,
                        `<p>This email is to notify you that <b>${user.first_name} ${user.last_name}</b> log into the YD Monitoring System.</p>
                        <p>Email: ${user.email}</p>
                        <p>Position: ${user.position}</p>
                        <p>Date: ${new Date()}</p>`,
                        (err, info) => {
                            console.log(err);
                        }
                    )
                }
                return res.status(200).send({
                    ...loggedUser,
                    state
                });
            }); 
        } else {
            return res.status(200).send(loggedUser);
        }
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });
});

router.get("/profile", authJwt.verifyToken, (req, res) => {
    
    const userId = req.userId;
    
    User.findOne({
        where: {
            id: userId
        }
    })
    .then(user => {
        if (!user) {
            return res.status(404).send({ message: "User Not found." });
        }

        const loggedUser = {
            id: user.id,
            org_code: user.org_code,
            email: user.email,
            role: user.role,
            short_name: user.short_name,
            orgId: user.orgId,
            position: user.position,
            first_name: user.first_name,
            last_name: user.last_name,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }

        if(user.role === 'state') {
            State.findOne({
                where: {
                    YDMS_AU_id: user.orgId
                },
                include: [
                    {
                        model: Address,
                    },
                ],
            }).then(state => {
                return res.status(200).send({
                    ...loggedUser,
                    state
                });
            }); 
        } else {
            return res.status(200).send(loggedUser);
        }
    })
    .catch(err => {console.log(err)
        res.status(500).send({ message: err.message });
    });
})

router.put("/users", authJwt.verifyToken, (req, res) => {
    // Update User to Database
    User.update(
        { password: bcrypt.hashSync(req.body.password, 8) }, 
        {  where : { email: req.body.email }}
    )
    .then(user => {
        res.status(200).send({ 
            id: user.id,
            org_code: user.org_code,
            email: user.email,
            role: user.role,
            short_name: user.short_name,
            orgId: user.orgId,
            position: user.position,
            first_name: user.first_name,
            last_name: user.last_name,
            accessToken: token,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            message: "User was successfully updated!" });
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });
});

module.exports = router;