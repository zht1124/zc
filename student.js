const express=require("express");
const app=express();
const url=require("url")
let body_parser=require("body-parser")
app.use(body_parser.urlencoded({
    extended: false
}))
// cros跨域
app.all("*",function(req,res,next){
    res.header('Access-Control-Allow-Origin', '*'); 
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "*");
    next();  
});
const mongoose=require("mongoose");
mongoose.connect("mongodb://localhost/school",{
    useNewUrlParser: true,
    useUnifiedTopology: true,  
})
.then(()=>{
    console.log("连接数据库成功");
})
.catch((err)=>{
    console.log(err);
})
const studSchema=new mongoose.Schema({
    username:String,
    sex:String,
    age:Number
})
let stud=mongoose.model("stud",studSchema);
// 添加接口
app.get("/add",(req,res)=>{
    stud.create(req.query).then(data=>{
       data?res.send({status:1,msg:"添加成功"}):res.send({status:0,msg:"添加失败"})
    })
})
// 渲染页面
app.post("/show",(req,res)=>{
    stud.find().then(data=>{
        res.send(data)
    })
})
// 删除
app.post("/del",(req,res)=>{
    console.log(req.body);
    stud.findOneAndDelete({_id:req.body.id}).then(data=>{
        data?res.send({ok:1,msg:"删除成功"}):res.send({ok:0,msg:"删除失败"})
    })
})
// 返现
app.get("/edit",(req,res)=>{
    stud.find({_id:req.query.id}).then(data=>{
        res.send(data)
    })
})
// 确认修改
app.get("/confirm",(req,res)=>{
    stud.updateOne({_id:req.query.id},{sex:req.query.sex,username:req.query.username,age:req.query.age}).then(data=>{
        data?res.send({status:1,msg:"修改成功"}):res.send({status:0,msg:"修改失败"})
    })
})
app.listen(6061,()=>{
    console.log("6061 is runing");
})