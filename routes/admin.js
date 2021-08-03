var express = require('express');
var adminController=require('../controllers/admin.js');
var router = express.Router();

router.use((req,res,next)=>{  //这是在后端拦截  
    if(req.session.username && req.session.isAdmin){
        next()  //如果登陆了并且是管理员，就放行
    }else{
        res.send({
            msg: "没有管理权限",
            status: -1
        })
    }
})

/* GET users listing. */
router.get('/', adminController.index);
router.get('/usersList',adminController.usersList)
router.post('/updateFreeze',adminController.updateFreeze)
router.post('/deleteUser',adminController.deleteUser)
module.exports = router;
