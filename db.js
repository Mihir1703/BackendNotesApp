const mysql = require('my-sql')

const DBconnect = mysql.createConnection({
    host: 'localhost',
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
});

const connectToMySql = ()=>{
    DBconnect.connect(function(err) {
        if (err) throw err;
        else console.log(`Connected to MySql database named ${(process.env.database).toUpperCase()}!!`);
    });
}

module.exports = connectToMySql;