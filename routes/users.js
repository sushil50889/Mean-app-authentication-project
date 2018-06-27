var express = require('express');
var passport = require('passport');
var users = require('../model/model');
var controllers = require('../config/controller');
var path = require('path');
var multer = require('multer');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const config = require("../config/config");
var router = express.Router();


/* ADD users */
router.post('/add', function(req, res, next) {
    var newUser = new users(req.body);
    newUser.password = controllers.encryptPassword(req.body.password);
    // console.log(newUser);

    controllers.checkUserExist({
        email: req.body.email
    }, (err, data) => {
            if(err){
                controllers.failResponse(res, "Something Wrong. Please Try Again.");
            }else if(data){
                controllers.failResponse(res, "You Are Ready Registered. Please Login To Continue."); 
            }else{
                controllers.addUser(newUser, (err, data) => {
                    if(err){
                      //   console.log(err);
                        controllers.failResponse(res, "Something went wrong. Please try again.");                  
                    }else{
                        controllers.successResponse(res, "Registration Successful.");
                    }
                })
            }
        });    
});




//login user
router.post('/authUserCredentials', (req, res, next)=>{
    var userCred = req.body;
    // console.log(userCred); 
    
    controllers.checkUserExist({email : req.body.email}, (err, data) => {
        if(err){
            controllers.failResponse(res, "Something went wrong. Please try again.");
        }else if(!data){
            controllers.failResponse(res, "You Are Not Registered. Please Register to Continue.");
        }else{
            var passMatch = controllers.comparePassword(userCred.password, data.password);
            // console.log(passMatch); 
            if(!passMatch){
                controllers.failResponse(res, "Invalid Email or Password. Please try again.");
            }else if(data.active == false){
                // console.log("not activated");
                res.json({
                    success: true,
                    userActive: false,
                    msg: "Please Activate Your Account.",
                    user: {
                        id: data._id,
                        name: data.name,
                        email: data.email,
                        phone: data.phone
                    }
                })
            }else{
                console.log("generating token");
                var token = jwt.sign(data.toJSON(), config.secret, {expiresIn: 86400});
                res.json({
                    success: true,
                    userActive: true,
                    msg: "Login Successful.",
                    token: token
                });
            }
        }
    });
});



//Show profile route
router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    try{
    res.json({
    name : req.user.name,
    email: req.user.email,
    phone: req.user.phone,
    city: req.user.city
    });
    }catch(err){
        controllers.failResponse(res, "Something Went Wrong. Please try again.");
    }
});




//find a user
router.get('/findUser/:id', function(req, res, next) {
    controllers.findUserById(req.params.id, (err, data)=>{
      if(err){
        controllers.failResponse(res, "ERROR : Something Went Wrong. Please Try Again.");
       
      }else{
        res.json({
            success: true,
            user: {
                id: data._id,
                name: data.name,
                email: data.email,
                phone: data.phone
            }
        });
        }
    })
});





// //delete user
// router.delete('/delete/:id', function(req, res, next){

//     controllers.delProfilePic(req.params.id);

//     controllers.deleteUser(req.params.id, err => {
//         if(err){
//             res.json({
//                 success: false,
//                 msg: "Something wrong. Please try again."
//             });
//         }else{
//             res.json({
//                 success: true,
//                 msg: "User deleted successfully."
//             });
//         }
//     })
// });





// //edit user
// router.get('/edit/:id', function(req, res, next){
//     controllers.findUserById(req.params.id, (err, userData) => {
//         if(err){
//             res.json({
//                 success: false,
//                 msg: "Something wrong. Please try again."
//             });
//         }else{
//             res.json({
//                 success: true,
//                 data: userData
//             });
//         }
//     });
// });





// //update user
// router.put('/update/:id', function(req, res, next){
//     var userData = req.body;
    
//     controllers.updateUser(req.params.id, userData, (err, updatedData) => {
//         if(err){
//             res.json({
//                 success: false,
//                 msg: "Something wrong. Please try again."
//             });
//         }else{
//             res.json({
//                 success: true,
//                 msg: "Successfully updated."
//             });
//         }
//     });
// });






// //upload profile or avatar route
// router.post('/uploadPic/:id', (req, res, next) => {
//     controllers.upload(req, res, (err) => {
//       if(err){
//         res.json({
//             success: false,
//             msg: err
//         });
//         console.log(err);
//       } else {
//         if(req.file == undefined){
//             res.json({
//                 success: false,
//                 msg: "Sorry! No File Selected."
//             });
//         }else{
//           res.json({
//             success: true,
//             msg: "Great job! Image uploaded successfully."
//           });
//         }
//       }
//     });
//   });


module.exports = router;
