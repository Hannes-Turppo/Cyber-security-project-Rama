import { Request, Response, NextFunction } from "express";
import forge from "node-forge";

const decryptCredentials = (req: Request, res: Response, next: NextFunction) => {
    try {
        const privateKeyPem = process.env.RSA_PRIVATE_KEY as string;
        
        if (!privateKeyPem) {
            throw new Error("RSA private key is not defined in environment variables.");
        }
        
        const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
        
        // Decrypt username and password
        if (req.body.username && req.body.password) {
            req.body.username = privateKey.decrypt(
                forge.util.decode64(req.body.username), 
                "RSA-OAEP",
                {
                    md: forge.md.sha256.create(), 
                }
            );

            req.body.password = privateKey.decrypt(
                forge.util.decode64(req.body.password), 
                "RSA-OAEP",
                {
                    md: forge.md.sha256.create(), 
                }
            );
        }

        next();
    } catch (error) {
        console.error("Error decrypting credentials:", error);
        res.status(400).json({ message: "Invalid encrypted credentials" });
    }
};

export { decryptCredentials };