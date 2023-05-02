const { createPool }=require('mysql')
const pool=createPool({
    port:3306,
    host:'localhost',
    user:'root',
    pass:'',
    database:'rn_sms_db',
    connectionLimit:10
});
module.exports = pool