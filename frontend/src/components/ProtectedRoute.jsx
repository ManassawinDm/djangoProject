import {Navigate} from "react-router-dom"
import {jwtDecode} from "jwt-decode"
import api from "../api"
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants"
import { useState, useEffect } from "react"
import Loading from "./Loading"

function ProtectedRoute({children}){
    const [isAuthorized,setisAuthorized] = useState(null);
    useEffect(()=>{
        auth().catch(() => setisAuthorized(false))
    },[])


    const refreshToken = async ()=>{
        const refreshToken = localStorage.getItem(REFRESH_TOKEN)
        try {
            const res = await api.post("/token/refresh/",{
                refresh: refreshToken,
            });
            if(res.status == 200){
                localStorage.setItem(ACCESS_TOKEN,res.data.access)
                setisAuthorized(true)
            }else{
                setisAuthorized(false)
            }  
                  
        } catch (error) {
            console.log(error)
            
        }
    }

    const auth = async ()=>{
        const token = localStorage.getItem(ACCESS_TOKEN)

        if(!token){
            setisAuthorized(false)
            return
        }
        const decode = jwtDecode(token)
        const tokenExpiration = decode.exp
        const now = Date.now() / 1000

        if(tokenExpiration < now){
            await refreshToken()
        }else{
            setisAuthorized(true)
        }
    }

    if (isAuthorized === null){
        return <Loading/>
    }

    return isAuthorized ? children : <Navigate to="/login"/>
}

export default ProtectedRoute