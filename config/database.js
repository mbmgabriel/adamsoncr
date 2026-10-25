require('dotenv').config()
const mssqlConfig = {
  "username": process.env.DB_USERNAME,
  "password": process.env.DB_PASSWORD,
  "database": process.env.DB_DATABASE,
  "host": process.env.DB_HOST,
  "dialect": "mssql",
  ...(process.env.DB_PORT ? { port: Number(process.env.DB_PORT) } : {}),
  ...(process.env.NODE_ENV === 'production' ? { logging: false } : {}),
  dialectOptions: {
    // Observe the need for this nested `options` field for MSSQL
    instanceName: "MSSQLSERVER",
    options: {
      // Your tedious options here
      useUTC: false,
      dateFirst: 1,
      encrypt: process.env.DB_ENCRYPT !== 'false',
      trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true'
    }
  },
  "define": {
    "paranoid": true,
    "underscored": true,
    "timestamps": true,
    "createdAt": 'created_at',
    "updatedAt": 'updated_at',
    "deletedAt": 'deleted_at',
  }
}

const mysqlConfig = {
  "username": process.env.DB_USERNAME,
  "password": process.env.DB_PASSWORD,
  "database": process.env.DB_DATABASE,
  "host": process.env.DB_HOST,
  "dialect": "mysql",
  ...(process.env.DB_PORT ? { port: Number(process.env.DB_PORT) } : {}),
  ...(process.env.NODE_ENV === 'production' ? { logging: false } : {}),
  // dialectOptions: {
  //     // Observe the need for this nested `options` field for MSSQL
  //     instanceName:"MSSQLSERVER",
  //     options: {
  //       // Your tedious options here
  //       useUTC: false,
  //       dateFirst: 1
  //     }
  //   },
  "define": {
    "paranoid": true,
    "underscored": true,
    "timestamps": true,
    "createdAt": 'created_at',
    "updatedAt": 'updated_at',
    "deletedAt": 'deleted_at',
  }
}

const config = process.env.DB_DIALECT === 'mysql' ? mysqlConfig : mssqlConfig
module.exports = config
