const router = require("express").Router()
const User = require("../models/User")
const bcrypt = require("bcryptjs")
//注册API
router.post("/register", async (req,res)=>{
  try{
      //使用bcrypt改变密码，不可见
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password,salt)
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword
    })
    const user = await newUser.save()
    res.status(200).json(user)
  }catch(err){
    res.status(500).json(err)
  }
})
//登录API
router.post("/login",async (req,res)=>{
    
    try{
        const user = await User.findOne({email:req.body.email})
        !user && res.status(404).send("该用户不存在")
        const validPassword = await bcrypt.compare(req.body.password,user.password)
        !validPassword && res.status(404).json("密码错误")
        res.status(200).json(user)
    }catch(err){
        console.log(err)
    }
})

module.exports = router