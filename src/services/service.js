const { status } = require("express/lib/response")
const res = require("express/lib/response")
const { NULL } = require("mysql/lib/protocol/constants/types")
const Sql = require('./sqlTemplate')
const URL = require('url')
const { resolve } = require("path")

class Service{
  constructor(db) {
    this.db = db
    this.sql = new Sql(this.db)
  }
  async upcomingEvents() {
    return new Promise(async (resolve, reject) => {
      try {
        var date = new Date()
        var day = date.getDate()
        var month = date.getMonth()
        var year = date.getFullYear()
        var fullDate = year + '-' + (month+1) + '-' + day
        let response = await this.sql.executeQuery(`SELECT event_id,event_name,event_company,event_logo FROM EVENT WHERE event_start_date > ? ORDER BY event_start_date`, fullDate)
        resolve(response)
      }
      catch (e) {
        console.log('Error at upcoming Events', e)
        reject(e)
      }
    }) 
  }

  async myEvents(user) {
    return new Promise(async (resolve, reject) => {
      try {
        let response = await this.sql.executeQuery(`SELECT event_id,event_name,event_company,event_logo FROM EVENT WHERE user_id = ? ORDER BY event_start_date DESC`, user)
        //console.log(response)
        resolve(response)
      }
      catch (e) {
        console.log('Error at my Events', e)
        reject(e)
      }
    })
  }

  async registerUser(req){
    return new Promise(async (resolve, reject) => {
      try {
        let response
        var { firstName, lastName, email, password, confirmPassword } = req
        if (password === confirmPassword) {
          let query = await this.sql.executeQuery('SELECT * FROM user WHERE mail_id = ?', [email])
          if (query && query.length > 0) {
            response = { status: false }
          }
          else {
            query = await this.sql.insertQuery("INSERT INTO user (first_name,last_name,mail_id,user_password) VALUES (?,?,?,?)", [firstName, lastName, email, password])
            response = {status: true}
          } 
        }
        else {
          response = {status: false}
        }
        resolve(response)
      }
      catch (e) {
        console.log('Catch in myFunction: ', e)
        reject(e)
      }
    })
  }

  async loginUser(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let response = {}
        var { email, password } = req
        let query = await this.sql.executeQuery('SELECT * FROM user WHERE mail_id = ? && user_password = ?', [email, password])
        if (query.length > 0) {
          response['status'] = true
          response['data'] = query[0]
        }
        else {
          response['status'] = false
        }
        resolve(response) 
      }
      catch (e) {
        console.log('Error at login : ', e)
        reject(e)
      }
    })
  }

  async addEvent(req, logo, user){
    return new Promise(async (resolve, reject) =>{
      try {
        let response = {}
        var whoCanJoin = ""
        if (req.student == "on") {
          whoCanJoin = "student"
        }
        if (req.professional == "on") {
          if (whoCanJoin === "student") {
            whoCanJoin += ", "
          }
          whoCanJoin += "profession"
        }
        console.log(whoCanJoin)
        var query = 'INSERT INTO event (user_id, event_name, event_city, event_company, registration_fee, event_start_date, event_end_date, organiser_mail_id, organiser_phone_no, event_logo, event_desc, event_for, event_website) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)'
        var params = [user, req.eventName, req.cityName, req.collegeName, req.registrationFee, req.eventStartDate, req.eventEndDate, req.eventMailId, req.eventPhoneNo, logo, req.eventDesc, whoCanJoin, req.eventLink]
        query = await this.sql.insertQuery(query, params)
        var eventId = query.insertId
        var count = 1
        params=[]
        while (req[`contestName${count}`]) {
          params.push([eventId, req[`contestName${count}`], req[`contestVenue${count}`], req[`contestStartDate${count}`], req[`contestEndDate${count}`], req[`contestLink${count}`], req[`contestMode${count}`], req[`contestFee${count}`], req[`contestMailId${count}`], req[`contestPhoneNo${count}`], req[`contestDesc${count}`]])
          count += 1
        }
        query = 'INSERT INTO contest (event_id, contest_name, venue, contest_start_date, contest_end_date, contest_registration_link, contest_mode, contest_fee, contest_mail_id, contest_mobile_no, contest_desc) VALUES ?'
        query = await this.sql.insertQuery(query, [params]);
        if (query.insertId > 0) {
          response['status'] = true
        }
        resolve(response)
      }
      catch (e) {
        console.log('Error at addEvent', e)
        reject(e)
      }
    })
  }

  async fetchFullDetails(req, id) {
    return new Promise(async (resolve, reject) => {
      try {
        var { eventValue } = req
        var query = await this.sql.executeQuery(`SELECT * FROM ${id} WHERE event_id = ?`, eventValue)
        resolve(query)
      }
      catch (e) {
        console.log('Error at full Details', e)
      }
    })
  }

}

module.exports = Service
