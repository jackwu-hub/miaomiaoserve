var crypto=require('crypto')
var captcha=require('trek-captcha')


var setCrypto=(info)=>{  //这个info是传过来的要加密的密码
    return crypto.createHmac('sha256','$#%#(Jkk') //第二个参数是加密使用的串
                    .update(info)
                    .digest('hex')  //这个是加密格式
}

var createVerify=(req,res)=>{  //登陆页面的图片验证码
    return captcha().then((info)=>{
        req.session.verifyImg=info.token
        return info.buffer
    }).catch(()=>{
        return false
    })
}

module.exports={
    setCrypto,createVerify,
}