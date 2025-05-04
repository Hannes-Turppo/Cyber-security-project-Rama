import { Box, Button, Paper, TextField, Typography } from "@mui/material"
import {useState, useEffect} from "react"
import { useNavigate } from "react-router-dom"
import NodeRSA from "encrypt-rsa"

function Login() {
    const [loading, setLoading] = useState<boolean>(() => {return true})
    const [username, setUsername] = useState<string>(() => {return ""})
    const [password, setPassword] = useState<string>(() => {return ""})
    const [encryptedUsername, setEncryptedUsername] = useState<string>(() => {return ""})
    const [encryptedPassword, setEncryptedPassword] = useState<string>(() => {return ""})

    // use asymmetrical RSA public key to encrypt username and password before sending them
    const encryptCredentials = async () => {
        const nodeRSA = new NodeRSA()
        setEncryptedUsername(nodeRSA.encryptStringWithRsaPublicKey({text: username, publicKey:"-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC1NhpEyZ0OR7ENh8e1qW/hDwBpzJAHyUrGqZSkUIXKTPhcJRcNOoc5bj9ZE8ZJUGAe9pZfGrks6xXvlX0QbrQ7cviVg5ENZzu0Ukrf+3NH9YIyd80zWhJSpVczAaL849/Zy7Gdj8ONlqR9jjT4kLU+9NvcB+Nf7pOn3+jQmg8NEQIDAQAB-----END PUBLIC KEY-----"}))
        setEncryptedPassword(nodeRSA.encryptStringWithRsaPublicKey({text: password, publicKey:"-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC1NhpEyZ0OR7ENh8e1qW/hDwBpzJAHyUrGqZSkUIXKTPhcJRcNOoc5bj9ZE8ZJUGAe9pZfGrks6xXvlX0QbrQ7cviVg5ENZzu0Ukrf+3NH9YIyd80zWhJSpVczAaL849/Zy7Gdj8ONlqR9jjT4kLU+9NvcB+Nf7pOn3+jQmg8NEQIDAQAB-----END PUBLIC KEY-----"}))
    }

    // login with encrypted credentials
    const handleLogin = async () => {
        await encryptCredentials()

        const res = await fetch("api/user/login", {
            method: "post",
            headers: {
                "Content-Type": "application.json"
            },
            body: JSON.stringify({
                username: encryptedUsername,
                password: encryptedPassword
            })
        })
        if (res.ok) {
            const token = await res.json()
            localStorage.setItem("token", token)
            window.location.href="/"
        }
    }

    const handleRegister = async () => {
        await encryptCredentials()

        const res = await fetch("api/user/register", {
            method: "post",
            headers: {
                "Content-Type": "application.json"
            },
            body: JSON.stringify({
                username: encryptedUsername,
                password: encryptedPassword
            })
        })
        if (res.ok) {
            window.location.href="/login"
        }
    }

    // check if user has a token. if true, redirect to homepage
    const navigate = useNavigate()
    useEffect (() => {
        const token: string | null = localStorage.getItem("token")
        if (token) {
            window.location.href="/"
        } else {
            setLoading(false)
        }
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
                        <Typography sx={{fontSize: 20, pt: 5, pb: 2}}>Login or register</Typography>
                        <Box>
                            <TextField
                                placeholder="Username" 
                                onChange={(e) => {setUsername(e.target.value)}} 
                                sx={{ml: 1}}
                            />
                            <TextField
                                type="password"
                                placeholder="Password" 
                                onChange={(e) => {setPassword(e.target.value)}} 
                                sx={{ml: 0.5, mr: 1}}
                            />
                        </Box>
                        <Box>
                            <Button variant="contained" sx={{m: 1}} onClick={handleLogin}>Login</Button>
                            <Button variant="outlined" sx={{m: 1}} onClick={handleRegister}>Register</Button>
                        </Box>
                    </Paper>
                </>
            )}
        </>
    )
}

export {Login}