import { createContext, useReducer } from "react"
import AuthReducer from "./AuthReducer"
const INITIAL_STATE = { 
    //用户信息
    user:{
        _id:"60d499130c8297390447e5fa",
        profilePicture:"person/1.jpeg",
        coverPicture:"",
        followers:[],
        followings:[],
        isAdmin:false,
        username:"john",
        city:"New York",
        from:"Maderid",
        relationship:"1",
        email:"john@gmail.com"
    },
    //是否在获取数据
    isFetching:false,
    //错误
    error:false
}

export const AuthContext = createContext(INITIAL_STATE)

export const AuthContextProvider = ({children})=>{
    const [state,dispatch] = useReducer(AuthReducer,INITIAL_STATE)
    return(
        <AuthContext.Provider 
            value={{
                user:state.user,
                isFetching:state.isFetching,
                error:state.error,
                dispatch
            }}>
            {children}
        </AuthContext.Provider>
    )
}
