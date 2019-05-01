const express = require('express')
const SparkMD5 = require('spark-md5')
const md5 = require('md5')
const token2id = require("../auth/token2id")

module.exports = (models) => {

  // how_to_import
  const _getters = require("../lib/getters")(models)

  const router = express.Router()

  router.get('/listgroups', async (req, res) => {
    try {
      let id = await token2id(req.get('x-access-token'))

      let isTeacher = await models.sequelize.query(`SELECT "isTeacher" from "Users" where userid = ?`, {
        replacements: [id],
      })

      isTeacher = isTeacher[0][0].isTeacher

      let sql;

      if (isTeacher) {
        sql = `SELECT * FROM "Courses" WHERE "TeacherTid" = ?`
        console.log("hi")
      } else {
        sql = `SELECT * FROM "Courses" WHERE cid IN (SELECT "CourseCid" as cid FROM "StudentCourse" WHERE "StudentSid" = ?)`
      }

      console.log(sql)

      let result = await models.sequelize.query(sql, {
        replacements: [id]
      })

      console.log(result[0])
      res.json(result[0])

    } catch (e) {
      res.json(e)
    }
  })

  router.post("/createcourse", async (req, res) => {

    try {

      let id = await token2id(req.get('x-access-token'))

      let isTeacher = await _getters.isTeacher(id)

      if (!isTeacher) throw ("ID is not a teacher")

      let oldCid = await models.sequelize.query(`SELECT cid from "Courses" ORDER BY cid DESC LIMIT 1`)
      oldCid = oldCid[0]

      let currCid;
      if (oldCid.length == 0) {
        currCid = 0
      } else {
        currCid = oldCid[0] + 1
      }

      let hash = md5(req.body.cname + currCid.toString())

      let date = new Date()
      date = date.toJSON()


      /* to create a new teacher 
      // let sql = `INSERT INTO "Teachers" VALUES (?, ?, ?) RETURNING *`
      // let teacher = await models.sequelize.query(sql, {
      //   replacements: [id, date, date]
      // })
      */

      let sql = `INSERT INTO "Courses"("cname", "joinKey", "TeacherTid", "createdAt", "updatedAt", "startDate") VALUES(?,?,?,?,?,?) RETURNING *`
      let course = await models.sequelize.query(sql, {
        replacements: [req.body.cname, hash, id, date, date, date]
      })

      /* how_to_use 
      let newCid = course[0][0].cid
      let newTid = await _getters.getTidFromCourse(newCid) //or use "then"
      */

      res.json(course[0][0])
    } catch (e) {
      res.json(e)
    }
  })

  router.post("/joincourse", async (req, res) => {
    try {

      let id = await token2id(req.get('x-access-token'))
      let isStudent = !(await _getters.isTeacher(id))

      if (!isStudent) throw ("id is not a student")

      let sql = `SELECT cid FROM "Courses" WHERE "joinKey" = '${req.body.joinKey}'`

      console.log(sql)

      let course = await models.sequelize.query(sql, {
        replacements: []
      })

      console.log(course)

      let date = new Date()
      date = date.toJSON()


      sql = `INSERT INTO "StudentCourse"("CourseCid", "StudentSid", "createdAt", "updatedAt") VALUES(?,?,?,?) RETURNING *`

      let result = await models.sequelize.query(sql, {
        replacements: [course[0][0].cid, id, date, date]
      })

      res.json(result[0][0])

    } catch (e) {
      console.log("noo....", e)
      res.json("error")
    }

  })



  return router
}

