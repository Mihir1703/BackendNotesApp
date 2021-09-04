require('dotenv').config()
const sqlconnect = require('./db')
sqlconnect()

const express = require('express')
const port = process.env.port