var {Email,Head}=require('../untils/config.js')
var UserModel=require('../models/users.js')
var {setCrypto, createVerify}=require('../untils/base.js')
var fs=require('fs') //引入文件操作
var url=require('url')
//登陆
/**
 * @api {post} /api2/users/login Login 
 * @apiName login
 * @apiGroup User
 * @apiParam {String} username 用户名
 * @apiParam {String} password 密码
 * @apiParamExample {json} request-example
 * {
 *  "username": "123",
 *  "password": "bbbb"
 * } 
 * @apiError {String} msg 错误信息
 * @apiErrorExample {json} error-example
    {
    "msg": "登录失败,密码错误",
    "status": -3
    }
 * 
 * @apiSussess {String} username 用户名
 * @apiSussess {String} password 密码
 * @apiSuccessExample {json} success-example
 * {
    * "msg": "登录成功",
    *  "status": 0
 *  }
 * @apiSampleRequest off
 */
var login=async(req,res,next)=>{
    var {username,password,verifyImg}=req.body

    if(verifyImg!==req.session.verifyImg){
        res.send({
            msg: '验证码输入不正确',
            status: -3
        })
        return  //退出
    }

    var result=await UserModel.findLogin({
        username,
        password: setCrypto(password) //密码加密
    })
    if(result){

        req.session.username=username
        req.session.isAdmin=result.isAdmin
        req.session.userHead=result.userHead //把用户头像存放到服务器中的session会话


        if(result.isFreeze){ //如果账号冻结就登陆不了
            res.send({
                msg: '账号已冻结',
                status: -2
            })
        }else{
            res.send({
                msg: '登录成功',
                status: 0
            })
        }
        
    }else{
        res.send({
            msg: '登录失败,密码错误',
            status: -3   //代表登录失败
        })
    }
}
//注册
var register=async(req,res,next)=>{
    var {username,password,email,verify}=req.body //把用户的输入存入对应的字段,接口测试时参数就是这4个字段
    if(email!==req.session.email||verify!==req.session.verify){
        res.send({
            msg: '验证码错误',
            status: -1
        })
        return 
    }

    if((Email.time-req.session.time)/1000>60){ //如果验证码超过1分钟，就过期了。
        res.send({
            msg: '验证码过期',
            status: -3
        })
        return
    }

    var result=await UserModel.save({ //增   这个是要写入数据库的，日期是默认的，所以这里没写入
        username,
        password: setCrypto(password),  //对密码进行加密处理
        email,
    })

    if(result){
        res.send({
            msg: '注册成功',
            status: 0
        })
    }else{
        res.send({
            msg: '注册失败',
            status: -2   //代表注册失败
        })
    }
}
//邮箱验证码
var verify=async(req,res,next)=>{
    var email=req.query.email  //获取请求时所带的参数 email的值
    var verify=Email.verify 

    req.session.verify=verify  //把这个验证码持久化
    req.session.email=email   //把这个邮箱也持久化，作用是保证这个这个验证码对应这个邮箱
    req.session.time=Email.time //把当前的时间毫秒数保存到session中


    let info = await Email.transporter.sendMail({ //Email.transporter这个是得到Email对象的config这个属性（这个
        from: '喵喵网 542910960@qq.com', // sender address
        to: email, // list of receivers
        subject: "喵喵网邮箱验证码", // Subject line
        text: "验证码："+verify, // plain text body
        //html: "<b>Hello world?</b>", // html body
      });

      if(info){
          res.send({
              msg: '验证码发送成功',
              status: 0,
          })
      }else{
          res.send({
              msg: '验证码发送失败',
              status: -1,
          })
      }
}
//注销
var logout=async(req,res,next)=>{
    req.session.username=''
    res.send({
        msg: '退出成功',
        status: 0
    })
}
//获取用户信息
/**
 *  @api {get} /api2/users/getUser getUser
    @apiVersion 0.0.0
    @apiName getUser
    @apiGroup User

    @apiDescription API to get the user information.

    @apiSuccess {Object} userInfo Info of the User.
    @apiSuccessExample {json} Success-Response:
        HTTP/1.1 200 OK
        {
            "msg": "获取用户信息成功",
            "status": 0,
            "data": {
                "username": "admin",
                "isAdmin": true,
                "userHead": "http://localhost:3000/uploads/admin.jpeg"
            }
        }

    @apiError UserNotFound The <code>user_id</code> of the User was not found.

    @apiErrorExample {json} Error-Response:
        HTTP/1.1 404 Not Found
        {
            "msg": "获取用户信息失败",
            "status": -5
        }
 */
var getUser=async(req,res,next)=>{
    if(req.session.username){
        res.send({
            msg: '获取用户信息成功',
            status: 0,
            data: {
                username: req.session.username, 
                isAdmin: req.session.isAdmin,
                userHead: req.session.userHead  
            }
        })
    }else{
        res.send({
            msg: '获取用户信息失败',
            status: -5  
        })
    }
}
//修改密码
var findPassword=async(req,res,next)=>{
    var {email,password,verify}=req.body

    if((Email.time-req.session.time)/1000>60){ //如果验证码超过1分钟，就过期了。
        res.send({
            msg: '验证码过期',
            status: -3
        })
        return
    }

    if(email===req.session.email&&verify===req.session.verify){
        var result=await UserModel.updatePassword(email,setCrypto(password))
        if(result){
            res.send({
                msg: '修改密码成功',
                status: 0
            })
        }else{
            res.send({
                msg: '修改密码失败',
                status: -6
            })
        }
    }else{
        res.send({
            msg: '邮箱名不对或者验证码不对',
            status: -1
        })
    }
}
//登陆时的图片验证码
var verifyImg=async(req,res,next)=>{
    var result=await createVerify(req,res)
    if(result){
        res.send(result)
    }
}

//更改用户头像
var uploadUserHead=async(req,res,next)=>{
        //因为从前台传过来时它要转为二进制，所以文件要重命名，要不然它是一串奇怪的字母。
    await fs.rename('public/uploads/'+req.file.filename,'public/uploads/'+ req.session.username+'.jpeg',function(err){
        if(err){
            throw err
        }
    } )
    
    var result=await UserModel.updateUserHead(req.session.username,url.resolve(Head.baseUrl,req.session.username+'.jpeg'))

    if(result){
        res.send({
            msg: '头像修改成功',
            status: 0,
            data: {
                userHead: url.resolve(Head.baseUrl,req.session.username+'.jpeg')
            }
        })
    }else{
        res.send({
            msg: '头像修改失败',
            status: -1
        })
    }
}
module.exports={
    login,
    register,
    verify,
    logout,
    getUser,
    findPassword,
    verifyImg,
    uploadUserHead,
}