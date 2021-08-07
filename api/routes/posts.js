const router = require("express").Router()
const Post = require("../models/Post")
const User = require("../models/User")
//创建一个动态
router.post("/", async (req,res)=>{
    const newPost = new Post(req.body)
    try{
        const savedPost = await newPost.save()
        res.status(200).json(savedPost)
    }catch(err){
        res.status(500).json(err)
    }
})
//更新一个动态
router.put("/:id", async (req,res)=>{
    try{
        const post = await Post.findById(req.params.id)
        if(post.userId === req.body.userId){
            await post.updateOne({$set:req.body})
            res.status(200).json("更新成功")
        }else{
            res.status(403).json("你只能更新你自己的动态")
        }
    }catch(err){
        res.status(500).json(err)
    }  
})
//删除一个动态
router.delete("/:id", async (req,res)=>{
    try{
        const post = await Post.findById(req.params.id)
        if(post.userId === req.body.userId){
            await post.deleteOne()
            res.status(200).json("删除成功")
        }else{
            res.status(403).json("你只能删除你自己的动态")
        }
    }catch(err){
        res.status(500).json(err)
    }  
})
//喜欢||取消喜欢一个动态
router.put("/:id/like",async (req,res)=>{
    try{
        const post = await Post.findById(req.params.id)
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({$push:{likes:req.body.userId}})
            res.status(200).json("已经点击喜欢")
        }else{
            await post.updateOne({$pull:{likes:req.body.userId}})
            res.status(200).json("取消喜欢")
        }
    }catch(err){
        res.status(500).json(err)
    }
})
//获取一个动态
router.get("/:id", async (req,res)=>{
    try{
        const post = await Post.findById(req.params.id)
        res.status(200).json(post)
    }catch(err){
        res.status(500).json(err)
    }
})
//获取用户和朋友所有动态
router.get("/timeline/:userId", async (req,res)=>{
    try{
        const currentUser = await User.findById(req.params.userId)
        const userPosts = await Post.find({ userId:currentUser._id })
        const friendPosts = await Promise.all(
        currentUser.followings.map((friendId)=>{
                return Post.find({ userId:friendId })
            })
        )
        res.status(200).json(userPosts.concat(...friendPosts))
    }catch(err){
        res.status(500).json(err)
    }
    
})
//获取该用户自己的动态
router.get("/profile/:username", async (req,res)=>{
    try{
        const user = await User.findOne({username:req.params.username})
        const posts = await Post.find({userId:user._id})
        res.status(200).json(posts)
    }catch(err){
        res.status(500).json(err)
    }
    
})
module.exports = router