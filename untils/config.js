var mongoose=require('mongoose')  //先创建一个连接数据库的公共方法
var nodemailer=require('nodemailer') //引入邮箱验证
var Mongoose={  //创建对象
    url: 'mongodb://localhost:27017/miaomiao',
    connect(){
        mongoose.connect(this.url,{ useUnifiedTopology: true,useNewUrlParser: true },(err)=>{ //{ useUnifiedTopology: true }这个是在连接数据库时有一个警告，配置了这个后警告消失了
            if(err){
                console.log('数据库连接失败')
            }
            console.log('数据库连接成功')
        })
    }
}
//配置邮箱验证
var Email={
    config: {
        host: "smtp.qq.com",  //这里使用了qq邮箱来发送验证码
        post: 587,
        //secure: false,
        auth: {
            user: '542910960@qq.com',  //邮件发送者
            pass: 'zftafgnozfugbcci'  //这个授权码
        }
    },
    get transporter(){ //使用了 get ,该方法在调用时就可以像调用属性一样，直接 Email.transporter 就可以了。
        return nodemailer.createTransport(this.config)
    },
    get verify(){ //这个是方法
        return Math.random().toString().substring(2,6)  //取4位验证码
    },
    get time(){
        return Date.now() //返回当前的毫秒数
    }
}

//这个是存储的用户头像的地址
var Head={
    baseUrl: 'http://localhost:3000/uploads/'
}

module.exports={  //把这个对象暴露出去
    Mongoose,
    Email,
    Head
}