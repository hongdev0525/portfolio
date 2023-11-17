const mysql = require("mysql2/promise");
module.exports =  mysql.createPool({
  // connectionLimit: 10,
  // acquireTimeout: 10000,
  host: "database-1.ceftbubo69hg.ap-northeast-2.rds.amazonaws.com",
  port: 3306,
  user: "admin",
  password: "Door2022!!",
  database: "doormarket",
  dateStrings: true
});;

