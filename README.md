# Cyber-security-project-Rama
Course project of the LUT-course "Cyber security of software systems".


Use instructions:

Make sure you have a MongoDB server running on port 27017

Navigate to project directory and run "npm install"

To start client and server, run "npm run dev:server" and "npm run dev:client"

To connect to client, connect to "localhost:3030/" from your browser.

When connected, non-authenticated users are redirected to the "/login"-page where they can either register a new account or log in to an existing account. When logged in, users can log out.

Not much functionality sure, but the purpose of this project is to implement authentication between client and server securely. Not to be a great experience.


Technologies used:

The server is implemented with NodeJS Express. The server is configured to run on port 8080 and client on 3030. Cross-origin connections are restricted through corsOptions.

Client is built using Vite-React with TypeScript and MaterialUI to make the client somewhat bearable to look at.

Node-Forge RSA asymmetric encryption is used to encrypt traffic from client to server.
User inputs are sanitized on the server after dectryption to prevent any malicious command injections.

User data is stored in a MongoDB server running on port 27017. Passwords stored on the server are encrypted with BCrypt and when logging in, BCrypt is used to compare user provided plaintext passwords with stored encrypted ones.

When logging in, the server generates a Json Web Token and returns it to the user upon succesfull login. The JWT is stored in browser's LocalStorage and expires in 2h.

After login, user is redirected to homepage, where JWT is used to fetch user data and display it. If no valid JWT is found, user is directed to login page.

When logging out, JWT is removed from localstorage and user is redirected to login page.

