var mongoose=require('mongoose')
var {Head} =require('../untils/config.js')
var url=require('url')

mongoose.set('useCreateIndex',true) //如果要下面的唯一值 能够生效，就要这一行



var UserSchema=new mongoose.Schema({
    username: {type: String,required: true,index: {unique: true}}, //后面的index 中的unique代表是否是唯一的
    password: {type: String,required: true},
    email: {type: String,required: true,index: {unique: true}},
    date: {type: Date,default: Date.now()},
    isAdmin: {type: Boolean,default: false},
    isFreeze: {type: Boolean,default: false},//账号是否冻结
    userHead: {type: String,default: url.resolve(Head.baseUrl,'default.jpeg')} //url.resolve这个方法是把两个参数拼接到一起形成一个新的url
})

var UserModel=mongoose.model('user',UserSchema) //user是数据库中集合的名称
UserModel.createIndexes();  //到这里，上面的唯一值才生效

//增
var save=(data)=>{
    var user=new UserModel(data)
    return user.save().
            then(()=>{
                return true
            })
            .catch(()=>{
                return false
            })
}
//查
var findLogin=(data)=>{ 
    return UserModel.findOne(data);
}

//改
var updatePassword=(email,password)=>{
    return UserModel.update({email},{$set: {password}})
            .then(()=>{
                return true
            })
            .catch(()=>{
                return false
            })
}

//管理员页面   
//获取用户列表
var usersList=()=>{
    return UserModel.find()
}

//更新账号冻结状态
var updateFreeze=(email,isFreeze)=>{  //因为邮箱是一个唯一值，
    return UserModel.update({email},{$set: {isFreeze}})
        .then(()=>{
            return true
        })
        .catch(()=>{
            return false
        })
}

//删除账号
var deleteUser=(email)=>{
    return UserModel.deleteOne({email})
}

//更换用户头像
var updateUserHead=(username,userHead)=>{
    return UserModel.update({username},{$set: {userHead}})
            .then(()=>{
                return true
            })
            .catch(()=>{
                return false
            })
}
module.exports={
    save,findLogin,updatePassword,usersList,updateFreeze,deleteUser,updateUserHead,
}

