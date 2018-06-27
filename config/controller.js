var users = require('../model/model');
const fs = require('fs');
var path = require('path');
var multer = require('multer');
var bcrypt = require('bcryptjs');

var controller = {};

controller.addUser = (newUser, callback) => {
  newUser.save(callback);
}

controller.checkUserExist = (query, callback) => {
  users.findOne(query, callback);
}

controller.encryptPassword = (password) => {
  var salt = bcrypt.genSaltSync(8);
  return bcrypt.hashSync(password, salt);
}

controller.comparePassword = (password, hash) => {
  return bcrypt.compareSync(password, hash);
}

controller.successResponse = (res, message) => {
  return res.json({
          success: true,
          msg: message
        });
}

controller.failResponse = (res, message) => {
  return res.json({
          success: false,
          msg: message
        });
}



// controller.findAllUser = (queryData, callback) => {
//     users.find(queryData, callback);
// }

// controller.deleteUser = (queryData, callback) => {
//     users.findByIdAndRemove(queryData, callback);
// }

controller.findUserById = (queryData, callback) => {
    users.findById(queryData, callback);
}

controller.updateUser = (query, data, callback) => {
    users.findByIdAndUpdate(query, data, callback);
}

// controller.storage = multer.diskStorage({
//     destination: './angular-crud/src/assets/images',
//     filename: function(req, file, cb){
//       cb(null, file.fieldname + req.params.id + path.extname(file.originalname));
//     }
//   });

// controller.checkFileType = function (file, cb){
//     const filetypes = /jpeg|jpg|png|gif/;
//     const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = filetypes.test(file.mimetype);
  
//     if (extname && mimetype){
//       return cb(null, true);
//     }else{
//       cb('Sorry!!! Only images are allowed to upload.');
//     }
//   } 


// controller.upload = multer({
//     storage: controller.storage,
//     limits: {fileSize: 10000000},
//     fileFilter: function(req, file, cb){
//       controller.checkFileType(file, cb);
//     }
//   }).single('uploadedProfilePic');


// controller.delProfilePic = (id) => {
//   controller.findUserById(id, (err, data) => {
//     if(err){
//       console.log(err);      
//     }else{
//       // console.log(data.avatar);
//       try{
//         fs.unlinkSync('./angular-crud/src/assets/images/'+data.avatar);
//       }catch(error){
//         console.log(error);
//       }      
//     }
//   })
// }  



module.exports = controller;