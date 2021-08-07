import { useContext, useRef } from "react"
import "./login.css"
import { loginCall } from "../apiCalls"
import { AuthContext } from "../../context/AuthContext"
import { CircularProgress } from "@material-ui/core"

export default function Login() {
    //用useRef来获取邮箱和密码输入框的值（每次改变都会render，不用useState,可以避免render加载）
    const email = useRef()
    const password = useRef()
    const {user,isFetching,error,dispatch} = useContext(AuthContext)
    //处理提交登录页面
    const handleClick = (e)=>{
        e.preventDefault()
        loginCall({email:email.current.value,password:password.current.value},dispatch)
        
    }
    console.log(user)
    return (
        <div className="login">
            <div className="loginWrapper">
                <div className="loginLeft">
                    <h3 className="loginLogo">ZZN Social</h3>
                    <span className="loginDesc">
                        Connect with friends and the world around you on ZZN Social
                    </span>
                </div>
                <div className="loginRight">
                    <form className="loginBox" onSubmit={handleClick}>
                        <input 
                            placeholder="Email" 
                            className="loginInput"
                            type="email"
                            required
                            ref={email}
                         />
                         <input 
                            placeholder="Password" 
                            className="loginInput"
                            type="password"
                            required
                            // minLength="6"
                            ref={password}
                         />
                         <button className="loginButton" type="submit" disabled={isFetching}>
                            {isFetching ? <CircularProgress color="white" size="20px"/>: "Login"}
                        </button>
                         <span className="loginForgot">Forgot Password?</span>
                         <button className="loginRegisterButton">
                            {isFetching ? <CircularProgress color="white" size="20px"/>: "Creat a new account"}
                         </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
