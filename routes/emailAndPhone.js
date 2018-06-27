var express = require('express');
var users = require('../model/model');
var controllers = require('../config/controller');
var randomstring = require('randomstring');
var msg91 = require("msg91")("184440A82EtqhxWxEB5a117fce", "NODE7777", "4" );
var sendEmailOtp = require('../config/nodeMailer');
var router = express.Router();


router.post('/email&phone/sendVerifyCode/', (req, res, next) => {
    var userData = req.body;
    const phoneOtp = randomstring.generate({length: 4, charset: '123456789'});
    const emailOtp = randomstring.generate({length: 4, charset: '123456789'});
    // console.log('phone OTP : '+phoneOtp+' and Email OTP : '+emailOtp);
    var message = `Your verification code is ${phoneOtp}. Valid for 30 min Only. Thank you.`;

    msg91.send(userData.phone, message, function(err, response){
        if(err){
            controllers.failResponse(res, "Something Went Wrong. Please try again.");
        }else{
            sendEmailOtp(userData.name, userData.email, emailOtp);
            controllers.updateUser(userData.id, {phoneOtp: phoneOtp, emailOtp: emailOtp}, (err, updatedUser) => {
                if(err) {
                    controllers.failResponse(res, "Something Went Wrong. Please try again.");
                }else{
                    res.json({
                        success: true,
                        msg: "OTP Generated Successfully. Please Confirm Your Account To Continue.",
                        id: updatedUser._id
                    })
                }
            })
        }
    });
});





router.post('/email&phone/verifyOTP/', (req, res, next)=>{
    var userData = req.body;
    // console.log(userData.id);
    controllers.findUserById(userData.id, (err, foundUser)=>{
        if(err){
            controllers.failResponse(res, "ERROR : Something Went Wrong. Please try again.");
        }else if(!foundUser){
            controllers.failResponse(res, "ERROR : User Not Found.");
        }else{
            // console.log(foundUser.phoneOtp, foundUser.emailOtp);
            
            if(userData.phoneOtp == foundUser.phoneOtp && userData.emailOtp == foundUser.emailOtp){
                controllers.updateUser(userData.id, {active: true}, (err, updatedUser) => {
                    if(err) {
                        controllers.failResponse(res, "Something Went Wrong. Please try again.");
                    }else{
                        controllers.successResponse(res, "SUCCESS : Account Successfully Verified. Please Login To Continue.");
                    }
                })                
            }else{
                controllers.failResponse(res, "ERROR : Invalid OTP. Please Try Again.");
            }
        }
    })
});




module.exports = router;