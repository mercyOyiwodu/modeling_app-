const express= require('express')
const router = require('./routes/userRouter')
require('./config/database')
require('dotenv').config()
const port = process.env.PORT

const app = express()

app.use(express.json())
app.use(router)

app.listen(port,()=>{
    console.log(`my server is up and running on port ${port}`);
    
})