import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const {Pool}=pg;
const pool =new Pool({
    user:process.env.db_user,
    host:process.env.db_host,
    database:process.env.db_database,
    password:process.env.db_password,
    port:process.env.db_port,
});
export default pool;