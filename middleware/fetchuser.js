const jwt = require('jsonwebtoken')
const JWT_SECRET = 'MeraDeshMaahan'

const fetchuser =(req, res, next) => {
    try {
        let token = req.header('auth_token')
        if (!token) res.status(401).send({ error: "Use a valid token" })

        const data = jwt.verify(token, JWT_SECRET)
            req.email = data.email
            next()
    } catch (error) {
        if (!token) res.status(401).send({ error: "Use a valid token" })
    }
}

module.exports = fetchuser