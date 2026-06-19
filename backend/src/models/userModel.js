import pool from "../config/db.js";
export const findUserByEmail = async (email) => {
  const query = "SELECT * FROM users WHERE email=$1";
  const result = await pool.query(query, [email]);
  return result.rows[0];
};
export const findUserById = async (user_id) => {
  const query =
    "SELECT user_id, full_name, email, created_at FROM users WHERE user_id=$1";
  const result = await pool.query(query, [user_id]);
  return result.rows[0];
};
export const CreateUser = async (full_name, email, password_hash) => {
  const query = `INSERT INTO users(full_name,email,password_hash)
                 VALUES($1,$2,$3) 
                 RETURNING user_id,full_name,email,created_at`;
  const result = await pool.query(query, [full_name, email, password_hash]);
  return result.rows[0];
};
