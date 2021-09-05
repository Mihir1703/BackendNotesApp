const express = require('express')
const router = express.Router()
const { body, validationResult } = require('express-validator');
const DBconnect = require('../db')
const bcrypt = require('bcryptjs');

router.use(express.json())

router.post('/', [
    body('name', 'Please use a valid name').isLength({ min: 3 }),
    body('email', 'Please use a valid email').isEmail(),
    body('password', 'Please use a valid password').isLength({ min: 8 })
    
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ errors: errors.array() })
    }
    const salt = await bcrypt.genSalt(1)
    let hashPass = await bcrypt.hash(req.body.password,salt)
    let query = `insert into users value("${req.body.name}","${req.body.username}","${hashPass}","${req.body.email}")`
    DBconnect.query(query, (err) => {
        if (err) return res.json({ "status": "error", "message": err });
        else res.json({ "status": "success" });
    })
})


module.exports = router