class sqlTemplate{
  constructor(db) {
    this.db = db
  }
  async executeQuery(query, params) {
    return new Promise(async (resolve, reject) => {
      try {
        this.db.query(query, params, async(err, rows, fields) => {
          if (err) {
            resolve(err)
          }
          else {
            resolve(rows)
          }
        })
      }
      catch (e) {
        console.log('Catch in Execute Query: ', e)
        reject(e)
      }
    })
  }

  async insertQuery(query, params) {
    return new Promise(async (resolve, reject) => {
      try {
        this.db.query(query, params, (err, row) => {
          if (err) {
            resolve(err)
          }
          else {
            resolve(row)
          }
        })
      }
      catch (e) {
        console.log(e)
        reject(e)
      }
    })
  }
}

module.exports = sqlTemplate