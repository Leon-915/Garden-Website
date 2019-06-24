var express = require('express');
var router = express.Router();
var jwt = require('jwt-simple');
var users = require('../models/users.js');
var router = express.Router();
var passwordHash = require('password-hash');
var randomString = require("randomstring");
var payment = require('../routes/stripe.js');
var forgotpasswordMail = require('../mails/forgotPasswordMail.js');
var frontEndUrl = "http://knovator.in/";
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  service: 'gmail',

  auth: {
            user: 'testbypoisonous@gmail.com', // generated ethereal user
            pass: 'pankit123456'  // generated ethereal password
          }
        });

var authentication = {

    forgotPassword: function(req, res) {
        var newvalue = {
            $set: {
                resetpasswordToken: randomString.generate(16)
            }
        };
        console.log(newvalue, req.body.email);
        users.update({ email: req.body.email }, newvalue, function(error, result) {
            if (error) {
                return res.status(422).json({ status: false, message: "Unable to update token" });
            }
            users.findOne({ email: req.body.email }, function(error, result) {
                if (error) {
                    return res.status(422).json({ status: false, message: "Unable to find email" });
                }
                if (result != null) {
                    var resetpasswordUrl = frontEndUrl + 'password/reset/' + result.resetpasswordToken;
                    var mail = forgotpasswordMail.getMail(resetpasswordUrl, req.body.email);
                    transporter.sendMail(mail, function(error, info) {
                        if (error) {
                            return res.status(422).json({ status: false, message: "Unable to send mail" });;
                        } else {
                            return res.status(200).json({ status: true });;
                        }
                    });
                } else {
                  return res.status(422).json({ status: false, message: "Something went wrong" });;
                }

            });
        });
    },
    resetPassword: function(req, res) {
        var hash = passwordHash.generate(req.body.password); 
        
            var newvalue = {
                $set: {
                    password: hash,
                    resetpasswordToken: null
                }
            };
            users.update({ resetpasswordToken: req.body.token }, newvalue, function(error, result) {
                if (error) {
                    return res.status(422).send({ status: false, message: error });
                }
                return res.status(200).send({ status: true, message: 'password has been reset successfully' });
            });
        
    },


    socialLogin: function(req, res) {
        var self = this;

        var query = {};
        var data = req.body;
        if (req.body.provider === 'facebook') {
            query['facebookId'] = { $eq: req.body.uid };
            data['facebookId'] = req.body.uid;
        } else if (req.body.provider === 'google') {
            query['googleId'] = { $eq: req.body.uid };
            data['googleId'] = req.body.uid;
        }

        var requestJson = req.body

        console.log(query);
        users.findOne(query, function(err, user) {
            if (err || !user) {
                payment.createStripeUser(req.body.email, function(stripeuser, err) {

                    if (err) {


                        res.status(401);
                        res.json({
                            "status": 401,
                            "message": "Something went wrong please try again"
                        });

                    } else {
                        console.log("user stripe----" + stripeuser.id);
                        requestJson["stripe_customerid"] = stripeuser.id;
                        console.log("user ----" + requestJson.stripe_customerid);
                        users.create(data, function(err, user) {
                            if (err) {
                                res.status(401);
                                res.json(err);

                                return
                            }

                            var tokenData = genToken();
                            res.json({ success: true, tokenData: tokenData, user: user, price: 35, priceDiscounted: 30, serviceCharge: 5, byWeeklyDiscount: 7, weeklyDiscount: 11 });

                        });
                    }
                });
            } else {
                var tokenData = genToken();
                res.json({ success: true, tokenData: tokenData, user: user, price: 35, priceDiscounted: 30, serviceCharge: 5, byWeeklyDiscount: 7, weeklyDiscount: 11 });
            }


        })

    },


    validateUser: function(username, callback) {
        users.findOne({ email: username }, { password: 0, __deleted: 0 }, function(err, user) {
            if (err) {
                callback();
            } else {
                callback(user);
            }

        });


    },

    validate: function(username, password, callback) {


        users.findOne({ email: username }, {}, function(err, user) {

            if (err) {
                callback();
            } else {
                if (passwordHash.verify(password, user.password)) {
                    user.password = "";

                    callback(user);
                } else {
                    callback();
                }

            }
        });


    },


    login: function(req, res) {


        var username = req.body.username || '';
        var password = req.body.password || '';

        if (username == '' || password == '') {
            res.status(401);
            res.json({
                "status": 401,
                "message": "Invalid credentials"
            });
            return;
        }

        // Fire a query to your DB and check if the credentials are valid

        authentication.validate(username, password, function(dbUserObj) {

            if (!dbUserObj) { // If authentication fails, we send a 401 back
                res.status(401);
                res.json({
                    "status": 401,
                    "message": "Invalid_credentials"
                });
                return;
            } else {



                var tokenData = genToken();
                res.json({ success: true, tokenData: tokenData, user: dbUserObj, price: 35, priceDiscounted: 30, serviceCharge: 5, byWeeklyDiscount: 7, weeklyDiscount: 11 });
            }




        });



    },

    signup: function(req, res) {

        users.findOne({ email: req.body.email }, function(err, user) {
            if (user) {
                res.status(401);
                res.json({
                    "sucess": false,
                    "message": "User already exists"
                });

            } else {
                var requestJson = req.body

                console.log(req.body);


                payment.createStripeUser(req.body.email, function(stripeuser, err) {

                    if (err) {


                        res.status(401);
                        res.json({
                            "status": 401,
                            "message": "Something went wrong please try again"
                        });

                    } else {
                        console.log("user stripe----" + stripeuser.id);
                        requestJson["stripe_customerid"] = stripeuser.id;
                        console.log("user ----" + requestJson.stripe_customerid);
                        users.create(req.body, function(err, user) {
                            if (err) {
                                res.status(401);
                                res.json({
                                    "sucess": false,
                                    "message": "These was a problem"
                                });

                                return
                            }

                            user.password = "";
                            var tokenData = genToken();
                            res.json({ success: true, tokenData: tokenData, user: user, price: 35, priceDiscounted: 30, serviceCharge: 5, byWeeklyDiscount: 7, weeklyDiscount: 11 });

                        });
                    }
                });



            }

        });

    },

}


router.post('/login', authentication.login);
router.post('/signup', authentication.signup);
router.post('/socialLogin', authentication.socialLogin);
router.post('/forgot-password', authentication.forgotPassword);
router.post('/reset-password', authentication.resetPassword);

// private method
function genToken() {
    var expires = expiresIn(1); // 7 days
    var token = jwt.encode({
        exp: expires
    }, require('../config/secret')());

    return {
        token: token,
        expires: expires
    };
}

function expiresIn(numDays) {
    var dateObj = new Date();
    return dateObj.setDate(dateObj.getDate() + numDays);
}

function createUser(req, res) {

}
module.exports = router;