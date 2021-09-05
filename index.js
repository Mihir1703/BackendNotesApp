require('dotenv').config()
const DBconnect = require('./db')


const express = require('express')
const port = process.env.port
const app = express()
app.use(express.json())

app.use('/api/user_auth',require('./routes/auth'))

app.listen(port,()=>{
    console.log(`listerning to port ${port}`)
})