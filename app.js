import express from "express";
import * as http from 'http'
import * as path from 'path';
import {fileURLToPath} from 'url';
import { authRoute } from "./backend/authentication-services/router.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use('/auth',authRoute)
const server = http.createServer(app);
const port = process.env.PORT || 3000;

//const publicDirectoryPath = path.join(__dirname,'../public')

//app.use(express.static(publicDirectoryPath));


server.listen(port ,()=>{
    console.log('Server is up on Port: '+ port);
})