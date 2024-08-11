import express from "express";
import router from "./src/routes/router.js"
import errorHandler from "./src/middlewares/errorHandler.js";
import dotenv from 'dotenv'

const app = express()
const PORT = 3000

app.use(express.json())
dotenv.config();
app.use(router) 
app.use(errorHandler);

app.listen(PORT, () => {
    console.log("App funcionando en el puerto " + PORT);
})