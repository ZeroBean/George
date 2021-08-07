import "./share.css"
import {PermMedia,Label,Room,EmojiEmotions} from "@material-ui/icons"
import { useContext, useRef,useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import { Cancel } from "@material-ui/icons"
import axios from "axios"
export default function Share() {
    const {user} = useContext(AuthContext)
    const PF = process.env.REACT_APP_PUBLIC_FOlDER
    const desc = useRef()
    const [file,setFile] = useState(null)

    const submitHandler = async (e)=>{
        e.preventDefault()
        const newPost ={
            userId:user._id,
            desc:desc.current.value,
        }
        if(file){
            const data = new FormData()
            const fileName = Date.now() + file.name
            data.append("name",fileName)
            data.append("file",file)
            newPost.img = fileName
            try{
                await axios.post("/upload",data)
                window.location.reload()
            }catch(err){
                console.log(err)
            }
        }


        try{
           await axios.post("/posts",newPost)
        }catch(err){

        }
    }

    return (
        <div className="share">
            <div className="shareWrapper">
                <div className="shareTop">
                    <img 
                        src={user.profilePicture
                                ? PF + user.profilePicture
                                : PF + "person/noAvatar.png"
                            } 
                        alt="" 
                        className="shareProfileImg"
                    />
                    <input 
                        type="text" 
                        className="shareInput" 
                        placeholder="where are you?"
                        ref={desc}
                    />
                </div>
                <hr className="shareHr"/>
                {
                    file && (
                        <div className="shareImgContainer">
                            <img src={URL.createObjectURL(file)} alt="" className="shareImg"/>
                            <Cancel className="shareCancelImg" onClick={()=>setFile(null)}/>
                        </div>
                    )
                }
                <form className="shareBottom" onSubmit={submitHandler}>
                    <div className="shareOptions">
                        <label htmlFor="file" className="shareOption">
                            <PermMedia className="shareIcon" htmlColor="tomato"/>
                            <span className="shareOptionText">Photo/Video</span>
                            <input 
                                type="file" 
                                id="file" 
                                accept=".png,.jpg,.jpeg" 
                                onChange={(e)=>setFile(e.target.files[0])}
                                style={{display:"none"}}
                                />
                        </label>
                        <div className="shareOption">
                            <Label className="shareIcon" htmlColor="blue"/>
                            <span className="shareOptionText">Tag</span>
                        </div>
                        <div className="shareOption">
                            <Room className="shareIcon" htmlColor="green"/>
                            <span className="shareOptionText">Location</span>
                        </div>
                        <div className="shareOption">
                            <EmojiEmotions className="shareIcon" htmlColor="goldenrod"/>
                            <span className="shareOptionText">Feelings</span>
                        </div>
                    </div>
                    <button className="shareButton" type="submit">Share</button>
                </form>
            </div>
        </div>
    )
}
