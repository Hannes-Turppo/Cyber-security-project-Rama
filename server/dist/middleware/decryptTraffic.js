"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptCredentials = void 0;
const node_forge_1 = __importDefault(require("node-forge"));
const decryptCredentials = (req, res, next) => {
    try {
        const privateKeyPem = process.env.RSA_PRIVATE_KEY;
        if (!privateKeyPem) {
            throw new Error("RSA private key is not defined in environment variables.");
        }
        const privateKey = node_forge_1.default.pki.privateKeyFromPem(privateKeyPem);
        if (req.body.username && req.body.password) {
            req.body.username = privateKey.decrypt(node_forge_1.default.util.decode64(req.body.username), "RSA-OAEP", {
                md: node_forge_1.default.md.sha256.create(),
            });
            req.body.password = privateKey.decrypt(node_forge_1.default.util.decode64(req.body.password), "RSA-OAEP", {
                md: node_forge_1.default.md.sha256.create(),
            });
        }
        next();
    }
    catch (error) {
        console.error("Error decrypting credentials:", error);
        res.status(400).json({ message: "Invalid encrypted credentials" });
    }
};
exports.decryptCredentials = decryptCredentials;
