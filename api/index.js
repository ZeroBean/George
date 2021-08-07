const express = require('express')
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const helmet = require("helmet")
const morgan = require("morgan")
const app  = express()
const userRoute = require('./routes/users')
const authRoute = require('./routes/auth')
const postRoute = require('./routes/posts')
const multer = require("multer")
const path = require("path")


//使用dotenv
dotenv.config()
//链接使用mongodb
mongoose.connect(process.env.MONGO_URL,
        {
            useNewUrlParser:true,
            useUnifiedTopology:true,
            useCreateIndex: true
        },()=>{
            console.log("Connected to MongoDB")
})

app.use("/images",express.static(path.join(__dirname,"public/images")))

//使用中间件
app.use(express.json())
app.use(helmet())
app.use(morgan("common"))

//设置文件路由
const storage = multer.diskStorage({
    destination: (req, file, cb)=> {
      cb(null, "public/images")
    },
    filename: (req, file, cb)=>{
        console.log(req.body.name)
      cb(null,req.body.name)
    }
  })

const upload = multer({storage})
app.post("/api/upload",upload.single("file"),(req,res)=>{
    try{
        return res.status(200).json("file uploaded successfully")
    }catch(err){
        console.log(err)
    }
})

//使用路由
app.use("/api/users",userRoute)
app.use("/api/auth",authRoute)
app.use("/api/posts",postRoute)

app.get("/",(req,res)=>{
    res.send("welcome to homepage")
})
//监听端口
app.listen(8800,()=>{
    console.log("Backend server is running")
})