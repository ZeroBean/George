const router = require("express").Router()
const bcrypt = require("bcryptjs")
const User = require("../models/User")


//更新用户信息
router.put("/:id",async (req,res)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
        if(req.body.password){
            try{
                //对密码进行哈希操作
                const salt = await bcrypt.genSalt(10)
                req.body.password = await bcrypt.hash(req.body.password,salt)
            }catch(err){
                return res.status(500).json(err)
            }
        }
        try{
            const user = await User.findByIdAndUpdate(req.params.id,{
                $set:req.body
            })
            res.status(200).json("用户信息已经更新")
        }catch(err){
            return res.status(500).json(err)
        }
    }else{
        return res.status(403).json("你只能更新自己的账户")
    }
})
//删除用户信息
router.delete("/:id",async (req,res)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
        try{
            const user = await User.findByIdAndDelete(req.params.id)
            res.status(200).json("用户信息已经删除")
        }catch(err){
            return res.status(500).json(err)
        }
    }else{
        return res.status(403).json("你只能删除自己的账户")
    }
})
//获取单个用户信息,根据请求头不同对？后面的内容进行请求
//用户ID---用户名称---请求用户信息
router.get("/", async (req,res)=>{
    const userId  = req.query.userId
    const username = req.query.username
    try{
        const user = userId 
            ? await User.findById(userId) 
            : await User.findOne({username:username})
        const {password,updateAt,...other} = user._doc
        res.status(200).json(other)
    }catch(err){
        return res.status(500).json(err)
    }
})

//获取该用户的朋友
router.get("/friends/:userId", async (req,res)=>{
    try{
        const user = await User.findById(req.params.userId)

        //对数组中的数据发异步请求
        const friends = await Promise.all(
            user.followings.map(friendId => {
                return User.findById(friendId)
            })
        )
        let friendList = []
        friends.map(friend=>{
            const {_id,username,profilePicture} = friend
            friendList.push({_id,username,profilePicture})
        })
        res.status(200).json(friendList)
    }catch(err){
        res.status(500).json(err)
    }
})

//关注用户
router.put("/:id/follow", async (req,res)=>{
    if(req.body.userId !== req.params.id){
        try{
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId)
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({$push:{followers:req.body.userId}})
                await currentUser.updateOne({$push:{followings:req.params.id}})
                res.status(200).json("成功关注该用户")
            }else{
                res.status(403).json("你已经关注了该用户")
            }
        }catch(err){
            res.status(500).json(err)
        }
    }else{
        res.status(403).json("你不能关注自己")
    }
})
//取消关注用户
router.put("/:id/unfollow", async (req,res)=>{
    if(req.body.userId !== req.params.id){
        try{
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId)
            if(user.followers.includes(req.body.userId)){
                await user.updateOne({$pull:{followers:req.body.userId}})
                await currentUser.updateOne({$pull:{followings:req.params.id}})
                res.status(200).json("成功取消关注该用户")
            }else{
                res.status(403).json("你没有关注了该用户")
            }
        }catch(err){
            res.status(500).json(err)
        }
    }else{
        res.status(403).json("你不能取消关注自己")
    }
})
module.exports = router