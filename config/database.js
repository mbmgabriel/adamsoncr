require('dotenv').config()
/* console.log(process.env.DB_USERNAME)

console.log(process.env.DB_PASSWORD) */
const mssqlConfig = {
  "username": process.env.DB_USERNAME,
  "password": process.env.DB_PASSWORD,
  "database": process.env.DB_DATABASE,
  "host": process.env.DB_HOST,
  "dialect": "mssql",
  dialectOptions: {
    // Observe the need for this nested `options` field for MSSQL
    instanceName: "MSSQLSERVER",
    options: {
      // Your tedious options here
      useUTC: false,
      dateFirst: 1
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

//console.log(process.env.DB_USERNAME)
//console.log(process.env.DB_PASSWORD) 

const config = process.env.DB_DIALECT === 'mysql' ? mysqlConfig : mssqlConfig
module.exports = config
