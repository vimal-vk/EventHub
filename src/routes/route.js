const res = require('express/lib/response')
const Service = require('../services/service') 
const path = require('path')
const multer = require('multer')
var multipart = require('connect-multiparty');
const { NULL } = require('mysql/lib/protocol/constants/types');
var multipartMiddleware = multipart();

class Route {

  constructor(app, db, directory) {
    this.app = app
    this.db = db
    this.directory = directory
    this.service = new Service(this.db)
    this.data = {
      'user': -1,
      'data': {
      }
    }

    this.storage = multer.diskStorage({
      destination: this.directory + '\\public\\images\\',
      filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
      }
    })

    this.upload = multer({
      storage:this.storage
    }).single('eventLogo')
  }

  async init() {
    this.app.get("/", (req, res) => {
      res.render(this.directory + "/views/index.ejs", this.data);
    });

    this.app.get("/events", async (req, res) => {
      this.data.data['event_details'] = await this.service.upcomingEvents()
      res.render(this.directory + "/views/events.ejs", this.data);
    });

    this.app.get("/login", (req, res) => {
      delete this.data.data['status']
      res.render(this.directory + "/views/login.ejs", this.data);
    })

    this.app.get("/register", (req, res) => {
      delete this.data.data['status']
      res.render(this.directory + "/views/register.ejs", this.data);
    })

    this.app.get("/user", async (req, res) => {
      if (this.data.user == -1) {
        res.redirect('/login')
      }
      else {
        this.data.data['my_event_details'] = await this.service.myEvents(this.data.user)
        //console.log(this.data)
        res.render(this.directory + "/views/user.ejs", this.data);
      }
    })

    this.app.get("/create", (req, res) => {
      delete this.data.data['status']
      if (this.data.user == -1) {
        res.redirect('/login')
      }
      else {
        res.render(this.directory + "/views/createevent.ejs", this.data);
      }
    })

    this.app.post("/register", async (req, res) => {
      let result = await this.service.registerUser(req.body)
      this.data.data = result
      res.render(this.directory + "/views/register.ejs", this.data);
    })

    this.app.post("/login", async (req, res) => {
      let result = await this.service.loginUser(req.body)
      if (result.status) {
        this.data.user = result.data.user_id
        this.data.data['status'] = result.status
        this.data.data['user_details'] = result.data
        res.redirect('/user')
      }
      else {
        this.data.data['status'] = result.status
        res.render(this.directory + "/views/login.ejs", this.data);
      }
    })

    this.app.post("/signOut", (req, res) => {
      this.data.user = -1
      delete this.data.data['user_details']
      delete this.data.data['my_event_details']
      delete this.data.data['status']
      res.redirect('/login')
    })

    this.app.post("/create", this.upload, async (req, res) => {
      let result = await this.service.addEvent(req.body, req.file.filename, this.data.user)
      this.data.data['status'] = result.status
      res.render(this.directory + "/views/createevent.ejs", this.data)
    })

    this.app.post("/singleevent", async (req, res) => {
      this.data.data['event_details'] = await this.service.fetchFullDetails(req.body,'event')
      this.data.data['contest_details'] = await this.service.fetchFullDetails(req.body, 'contest')
      res.render(this.directory + "/views/singleevent.ejs", this.data)
    })
  }
}

module.exports = Route;

