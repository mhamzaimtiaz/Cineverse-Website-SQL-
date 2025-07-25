const sql = require("mssql");

const dbConfig = {
  server: "localhost\\SQLEXPRESS",
  port: 1433,
  database: "Cineverse",
  authentication: {
    type: "ntlm",
    options: {
      domain: "LENOVO-T480S",
      userName: "RAJA OMAR",
      password: "raja1234",
    },
  },
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

const poolPromise = new sql.ConnectionPool(dbConfig)
  .connect()
  .then((pool) => {
    console.log("Successfully Connected to MSSQL");
    return pool;
  })
  .catch((err) => {
    console.error("Connection failed:", err);
    throw err;
  });

module.exports = { sql, poolPromise };
