import { Button, TextField, Typography } from "@mui/material"
import React, {useEffect} from "react"
import { IUser } from "../interfaces/IUser"


function Home() {
    const [loading, setLoading] = React.useState<boolean>(() => {return true})
    const [validToken, setValidToken] = React.useState<boolean>(() => { return false })
    const [user, setUser] = React.useState<IUser | null>(() => {return null})
  


    // init component when navigated to
    const navigate = useNavigate()
    useEffect(() => {
        const initialize = async () => {
        try {

            const validToken: boolean = await validateToken()
            if (validToken) {
                setValidToken(validToken)
          
                // get user info from server
                const res = await fetch("api/user", {
                    headers: {
                        "authorization": `Bearer: ${localStorage.getItem("token")}`
                    }
                })
                if (res.ok) {
                    const data = await res.json() as IUser
                    setUser(data)
                }
            }
      
        setLoading(false)
        } catch (error: any) {
        console.log(error)
        }
    }
    initialize()
  },[navigate])



    return (
        <Typography>

        </Typography>
    )
}

export {Home}
