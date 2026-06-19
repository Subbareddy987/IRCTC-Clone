import pool from './db.js';
try{
    const result =await pool.query('SELECT NOW()');
    console.log('Database Connectd');
    console.log(result.rows[0])
}catch(err){
    console.error(err.message);
}