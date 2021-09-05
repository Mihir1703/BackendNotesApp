const express = require('express')
const router = express.Router()
const { body, validationResult } = require('express-validator');
const DBconnect = require('../db')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'MeraDeshMaahan'
const fetchuser = require('../middleware/fetchuser')

router.use(express.json())

router.post('/createUser', [
    body('name', 'Please use a valid name').isLength({ min: 3 }),
    body('email', 'Please use a valid email').isEmail(),
    body('password', 'Please use a valid password').isLength({ min: 8 })

], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ errors: errors.array() })
    }
    try {
        let user
        await DBconnect.query(`select * from users where email = "${req.body.email}"`, async (err, data) => {
            if (data.length == 0) {
                const salt = await bcrypt.genSalt(1)
                let hashPass = await bcrypt.hash(req.body.password, salt)
                let query = `insert into users(name,username,password,email) value("${req.body.name}","${req.body.username}","${hashPass}","${req.body.email}")`
                DBconnect.query(query, (err) => {
                    if (err) return res.json({ "status": "error", "message": err });
                    DBconnect.query(`select * from users where email = "${req.body.email}"`, (err, users) => {
                        data = {
                            user: {
                                id: users.sNo
                            }
                        }
                        const auth_token = jwt.sign(data, JWT_SECRET)
                        res.json({ "auth_token": auth_token })
                    })
                })
            } else {
                return res.status(500).send("Duplicate entry")
            }
        })

    } catch (error) {
        res.status(500).send("An error occures")
    }
})


router.post('/login', [
    body('email', 'Please use a valid email').isEmail(),
    body('password', 'Please use a valid password').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ errors: errors.array() })
    }

    const { email, password } = req.body
    try {

        await DBconnect.query(`select * from users where email = "${email}"`,  (err, data) => {
            if (data.length == 0) {
                return res.status(400).json({ error: "user does not exists or wrong credentials" })
            }else{
                bcrypt.compare(password, data.password,(err,success)=>{
                    if (success) {
                        return res.status(400).json({ error: "user does not exists or wrong credentials" })
                    }
                    info = {
                        email:data[0].email
                    }
                    const auth_token = jwt.sign(info, JWT_SECRET)
                    res.status(200).json({ "auth_token": auth_token })
                })
                
                
            }
        })
    }catch(err){
        res.status(500).send("Internal Server error")
    }
})

router.post('/getuserdata',fetchuser,async (req,res)=>{
    try {
        await DBconnect.query(`select * from users where email = "${req.email}"`,(err,data)=>{
            if(err) throw err
            else res.send(data[0])
        })
    } catch (error) {
        res.status(400).send("Does not exists")
    }
})

module.exports = router