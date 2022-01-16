const express = require('express')
const app = express()
const Sql = require('./database/sqlConnection')
const Route = require('./routes/route')
const bodyParser = require('body-parser')
require('dotenv').config()
app.set('view engine','ejs')
app.use(express.static(__dirname+'\\public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`port is running at ${port}`)
})

const sqlObject = new Sql(app).init()
const routeObject = new Route(app,sqlObject,__dirname)
routeObject.init()