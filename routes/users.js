var express = require('express');
var usersController=require('../controllers/users.js');
var router = express.Router();

var multer=require('multer')  //这个插件是用来获取客户端发送过来的图片
var upload=multer({dest: 'public/uploads/'}) //指向存放图片的目录

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
//路由接口  //
router.post('/login',usersController.login);
router.post('/register',usersController.register);
router.get('/verify',usersController.verify);
router.get('/logout',usersController.logout);
router.get('/getUser',usersController.getUser);
router.post('/findPassword',usersController.findPassword);
router.get('/verifyImg',usersController.verifyImg);
                              //upload.single代表单张图片，single中的参数是key值
router.post('/uploadUserHead',upload.single('file'),usersController.uploadUserHead)

module.exports = router;
