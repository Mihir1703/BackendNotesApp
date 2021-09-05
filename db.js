const mysql = require('my-sql')

const DBconnect = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
});

DBconnect.connect(function(err) {
    if (err) throw err;
    else console.log(`Connected to MySql database!!`);
});

module.exports = DBconnect;