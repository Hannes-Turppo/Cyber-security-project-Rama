import { Box, Button, Paper, TextField, Typography } from "@mui/material"
import {useState, useEffect} from "react"
import { useNavigate } from "react-router-dom"
import forge from "node-forge";

function Login() {
    const [loading, setLoading] = useState<boolean>(() => {return true})
    const [username, setUsername] = useState<string>(() => {return ""})
    const [password, setPassword] = useState<string>(() => {return ""})

    // use asymmetrical RSA public key to encrypt username and password before sending them
    const encryptCredentials = () => {
        try {
            const publicKeyPem = `-----BEGIN PUBLIC KEY-----
    MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC1NhpEyZ0OR7ENh8e1qW/hDwBp
    zJAHyUrGqZSkUIXKTPhcJRcNOoc5bj9ZE8ZJUGAe9pZfGrks6xXvlX0QbrQ7cviV
    g5ENZzu0Ukrf+3NH9YIyd80zWhJSpVczAaL849/Zy7Gdj8ONlqR9jjT4kLU+9Nvc
    B+Nf7pOn3+jQmg8NEQIDAQAB
    -----END PUBLIC KEY-----`;
    
            const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
    
            // encrypt the username
            const encryptedUsername = forge.util.encode64(
                publicKey.encrypt(username, "RSA-OAEP", {
                    md: forge.md.sha256.create(),
                })
            );
            // encrupt password
            const encryptedPassword = forge.util.encode64(
                publicKey.encrypt(password, "RSA-OAEP", {
                    md: forge.md.sha256.create(),
                })
            );
    
            return ({
                username: encryptedUsername,
                password: encryptedPassword
            })
        } catch (error: any) {
            console.error("Error encrypting credentials:", error);
        }
    };

    // login with encrypted credentials
    const handleLogin = async () => {
        const encryptedCredentials: any = encryptCredentials()

        const res = await fetch("api/user/login", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: encryptedCredentials.username,
                password: encryptedCredentials.password
            })
        })
        if (res.ok) {
            const token = await res.json()
            localStorage.setItem("token", token.token)
            window.location.href="/"
        }
    }

    const handleRegister = async () => {
        const encryptedCredentials: any = encryptCredentials()

        const res = await fetch("api/user/register", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: encryptedCredentials.username,
                password: encryptedCredentials.password
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
                        <Typography sx={{fontSize: 20, pt: 3, mb: 2}}>Login or register</Typography>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column"
                            }}
                        >
                            <TextField
                                placeholder="Username" 
                                onChange={(e) => {setUsername(e.target.value)}} 
                                sx={{mx: 2}}
                            />
                            <TextField
                                type="password"
                                placeholder="Password" 
                                onChange={(e) => {setPassword(e.target.value)}} 
                                sx={{mx: 2, mt: 1}}
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