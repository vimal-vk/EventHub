const mysql = require('mysql')

class DBconnection {
  
  constructor(app) {
    this.app = app
  }

  init() {
    var mySqlConnection = mysql.createConnection({
      host: process.env.host,
      user: process.env.user,
      password: process.env.password,
      database: process.env.database,
      multipleStatements: true
    })

    mySqlConnection.connect((err) => {
      if (err) {
        console.log(err)
      }
      else {
        console.log("Connected")
      }
    })
    return mySqlConnection
  }
}

module.exports = DBconnection