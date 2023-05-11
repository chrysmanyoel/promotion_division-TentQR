const mysql  = require('mysql');

const conn = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tenda_promosi',
});

module.exports =  conn;