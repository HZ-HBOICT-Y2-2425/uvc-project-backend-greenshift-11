import mariadb from "mariadb";

const pool = mariadb.createPool({
  host: process.env.MARIADB_HOST || "localhost", // Database host
  user: process.env.MARIADB_USER || "root",     // Database user
  password: process.env.MARIADB_PASSWORD || "", // Database password
  database: process.env.MARIADB_DATABASE || "greenShiftDB", // Database name
  connectionLimit: 5,                           // Connection pool limit
});

export const query = async (sql, params) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const result = await connection.query(sql, params);
    return result;
  } catch (error) {
    console.error("Error in MariaDB query:", error);
    throw error;
  } finally {
    if (connection) connection.release(); // Release the connection back to the pool
  }
};

export default pool;
