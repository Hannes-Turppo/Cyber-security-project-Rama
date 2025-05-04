import { Box, Button, Paper, Typography } from "@mui/material"
import {useState, useEffect} from "react"
import { IUser } from "../interfaces/IUser"
import { useNavigate } from "react-router-dom"

function Home() {
    const [loading, setLoading] = useState<boolean>(() => {return true})
    const [user, setUser] = useState<IUser | null>(() => {return null})


    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href="/login";
    }

    const handleDelete = async () => {
        const res = await fetch("/user/delete", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(localStorage.getItem("token"))
        })
        if (res.ok) {
            window.location.href="/login"
        }
    }



    // useEffect is run when user navigates to page.
    // fetch user data from server and store it in state.
    const navigate = useNavigate()
    useEffect (() => {
        const getUser = async () => {
            const token: string | null = localStorage.getItem("token")
            if (!token) {
                window.location.href="/login"
            }
            const res = await fetch("api/user", {
                method: "get",
                headers: {
                    "authorization": `Bearer: ${token}`
                }
            })
            if (res.ok) {
                const localUser: IUser | null = await res.json()
                if (localUser) {
                    setUser(localUser)
                    setLoading(false)
                }
            } else {
                window.location.href="/login"
            }
        }
        getUser()
    },[navigate])

    return (
        <>
            {loading ? (
                <Paper>
                    <Typography>Loading...</Typography>
                </Paper>
            ) : (
                <>
                    <Paper>
                        <Typography>
                            Welcome {user?.username}
                        </Typography>
                        <Box>
                            <Button onClick={handleLogout}>Log out</Button>
                            <Button onClick={handleDelete}>Delete account</Button>
                        </Box>
                    </Paper>
                </>
            )}
        </>
    )
}

export {Home}
