import { useContext, useEffect, useState } from "react"
import Post from "../post/Post"
import Share from "../share/Share"
import "./feed.css"
import axios from "axios"
import { AuthContext } from "../../context/AuthContext"


export default function Feed({username}) {
    // 根据是否传入用户名请求不同数据
    //  profile页面传入username---请求该用户的post
    //  home页面不传---默认请求timeline
    const [posts,setPosts] = useState([])
    const {user} = useContext(AuthContext)

    useEffect(()=>{
        const fetchPosts = async ()=>{
            const res = username ? 
                        await axios.get("/posts/profile/" + username) 
                        : await axios.get(`posts/timeline/${user._id}`)
            setPosts(res.data.sort((p1,p2)=>{
                return new Date(p2.createdAt) - new Date(p1.createdAt)
            }))
        }
        fetchPosts()
    },[username,user._id])

    return (
        <div className="feed">
            <div className="feedWrapper">
                { (!username || username === user.username) && <Share/>}
                {
                    posts.map((item)=>(
                        <Post post={item} key={item._id}/>
                    ))
                }
            </div>
        </div>
    )
}
