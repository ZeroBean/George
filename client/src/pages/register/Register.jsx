import { useRef } from "react"
import "./register.css"
import axios from 'axios'
import { useHistory } from "react-router"

export default function Register() {
    const username = useRef()
    const email = useRef()
    const password = useRef()
    const passwordAgain = useRef()
    const history = useHistory()

    const handleClick = async (e)=>{
        e.preventDefault()
        if(passwordAgain.current.value !== password.current.value){
            password.current.setCustomValidity("Password don't match~")
        }else{
            const user = {
                username:username.current.value,
                email:email.current.value,
                password:password.current.value
            }
            try{
                await axios.post("/auth/register",user)
                history.push("/login")
            }catch(err){
                console.log(err)
            }
            
        }
    }

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
                            placeholder="Username" 
                            className="loginInput"
                            ref={username}
                            required
                        />
                        <input 
                            placeholder="Email" 
                            className="loginInput"
                            ref={email}
                            required
                            type="email"
                         />
                         <input 
                            placeholder="Password" 
                            className="loginInput"
                            ref={password}
                            required
                            type="password"
                         />
                         <input 
                            placeholder="Password Again" 
                            className="loginInput"
                            ref={passwordAgain}
                            required
                            type="password"
                         />
                         <button className="loginButton" type="submit">Sign Up</button>
                         <button className="loginRegisterButton">
                             Log into you account
                         </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
