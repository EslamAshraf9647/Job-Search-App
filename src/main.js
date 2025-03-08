import express from "express"
import {config} from "dotenv"
import { database_connection } from "./DB/connection.js"
import path from "path"
import routerhandler from "./Utils/router-handler.utils.js"
config()


const bootStrap = async ()=> {
    const app = express()
    app.use(express.json())
    app.use(express.urlencoded({extended: true}))
    await database_connection()
    routerhandler(app,express)
    


    app.listen(process.env.PORT ,()=> console.log("Server is Running on port ",process.env.PORT))
}

export default bootStrap 