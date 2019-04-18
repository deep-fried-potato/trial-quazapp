let express = require('express')
let token2id = require("../auth/token2id")

module.exports = function (models) {
  let getters = require("../lib/getters")(models)
  let router = express.Router()

  router.get("/listquizzes", (req, res) => {
    token2id(req.get("x-access-token")).then((id)=>{

        models.sequelize.query(`SELECT quizid from quizzes as quiz WHERE EXISTS (SELECT * FROM "StudentCourse" WHERE "StudentCourse"."StudentSid"=${id} AND "StudentCourse"."CourseCid"="quiz"."CourseCid")`).then(([result, metadata]) => {
          res.json(result)
        })
    }).catch((err)=>{
      res.status(403).json("Token Error")
    })
  })

  router.get("/getquiz/:quizid", (req, res) => {
    token2id(req.get("x-access-token")).then((id)=>{
        sql = `SELECT * FROM "quizzes" AS "quiz" WHERE "quiz"."quizid" =${req.params.quizid} AND EXISTS (SELECT * FROM "StudentCourse" WHERE "StudentCourse"."StudentSid"=${id} AND "StudentCourse"."CourseCid"="quiz"."CourseCid")`
        models.sequelize.query(sql).then(([result, metadata]) => {
          if(result[0].starttime<new Date()) res.json(result)
          else res.status(403).json("Sorry Test Didnt Start Yet")
        }).catch((err)=>{
          res.status(403).json("Quiz doesnt exist or you dont have permission to access it")
        })
    }).catch((err)=>{
      res.json("Token Error")
    })
  })

  router.post("/createquiz",async (req, res) => {
    token2id(req.get("x-access-token")).then(async (id)=>{
          if(await getters.isTeacher(id) && (await getters.getTidFromCourse(req.body.coursecid)==id)){
            qdata = JSON.stringify(req.body.qdata)
            answers = JSON.stringify(req.body.answers)
            date = new Date()
            date = date.toJSON()
            sql = 'INSERT INTO "quizzes" ("accesskey","quizname","qdata","answers","CourseCid","starttime","endtime","createdAt","updatedAt") VALUES (\'' + req.body.accesskey + '\',\'' + req.body.quizname + '\',\'' + qdata + '\',\'' + answers + '\','+req.body.coursecid+',\'' + req.body.starttime + '\',\'' + req.body.endtime + '\',\'' + date + '\',\'' + date + '\' ) RETURNING *'
            models.sequelize.query(sql).then(([result, metadata]) => {
              res.json(result)
            }).catch((err) => {
              res.json("Please Check quiz timings")
            })
          }
          else{
            res.status(403).json("Auth error. You might not have the permissions")
          }
      }).catch((err)=>{
        console.log(err)
        res.json("A token error occured")
      })
    })

  router.post("/getResponses", (req, res) => {
    token2id(req.get("x-access-token")).then((id)=>{
        sql = 'SELECT "id", "response", "createdAt", "updatedAt", "quizQuizid", "StudentSid" FROM "Responses" AS "Response" WHERE "Response"."StudentSid" = '+id+' AND "Response"."quizQuizid" =' + req.body.quizid +''
        models.sequelize.query(sql).then(([result, metadata]) => {
          res.json(result)
        }).catch((err) => {
          res.status(403).json("You havent clicked on start quiz yet")
        })
    }).catch((err)=>{
      res.status(403).json("Token Error")
    })
  })

  router.post("/startquiz",async (req, res) => {
    token2id(req.get("x-access-token")).then(async (id)=>{
        quizAuth = await models.sequelize.query(`SELECT * FROM quizzes as quiz WHERE "quiz"."quizid"=${req.body.quizid} AND EXISTS(SELECT * FROM "StudentCourse" WHERE "StudentCourse"."StudentSid"=${id} AND "StudentCourse"."CourseCid"="quiz"."CourseCid")`)
        if(quizAuth[0].length>0){
          date = new Date()
          date = date.toJSON()
          sql = 'INSERT INTO "Responses" ("response","createdAt","updatedAt","quizQuizid","StudentSid") SELECT  \'[]\', \'' + date + '\', \'' + date + '\', ' + req.body.quizid + ','+ id +' WHERE NOT EXISTS ( SELECT 1 FROM "Responses" WHERE "StudentSid"=' + id + ' AND "quizQuizid"=' + req.body.quizid + ' ) RETURNING *'
          models.sequelize.query(sql).then(([result, metadata]) => {
            res.json(result)
          }).catch((err) => {
            console.log(err)
            res.status(403).json("This is not the quiz timing")
          })
        }
        else{
          res.status(403).json("You are not authorized to take this test")
        }
    }).catch((err)=>{
      res.status(403).json("Token Error")
    })
  })

  router.post("/sendAnswer", async (req, res) => {
    token2id(req.get("x-access-token")).then(async (userid)=>{
        quizAuth = await models.sequelize.query(`SELECT * FROM quizzes as quiz WHERE "quiz"."quizid"=${req.body.quizid} AND EXISTS(SELECT * FROM "StudentCourse" WHERE "StudentCourse"."StudentSid"=${userid} AND "StudentCourse"."CourseCid"="quiz"."CourseCid")`)
        if(quizAuth[0].length>0){
          sql = 'SELECT * FROM "Responses" AS "Response" WHERE "Response"."StudentSid"= '+userid+' AND "Response"."quizQuizid"=' + req.body.quizid + ''
          models.sequelize.query(sql).then(([result, metadata]) => {
            id = result[0].id
            response = result[0].response
            response[req.body.question] = req.body.answer
            response = JSON.stringify(response)
            date = new Date()
            date = date.toJSON()
            sql = 'UPDATE "Responses" SET "response"=\'' + response + '\', "updatedAt"=\'' + date + '\' WHERE "id"=' + id + ' RETURNING *'
            models.sequelize.query(sql).then(([result, metadata]) => {
              res.json(result)
            }).catch((err) => {
              console.log(err)
              res.json("It is not quiz time")
            })
          }).catch((err) => {
            console.log(err)
            res.json("You havent clicked on startquiz")
          })
        }
        else{
          res.status(403).json("You are not authorized to take this test")
        }
    }).catch((err)=>{
      res.status(403).json("Token Error")
    })
  })

  router.get("/quizresults/:quizid",async (req,res)=>{
    token2id(req.get("x-access-token")).then(async (id)=>{
      if(await getters.isTeacher(id)){
          quizTeacherResults = await models.sequelize.query(`SELECT * FROM "Responses" WHERE "Responses"."quizQuizid"=${req.params.quizid}`)
          res.json(quizTeacherResults[0])
      }
      else{
        quizStudentResults = await models.sequelize.query(`SELECT * FROM "Responses" WHERE "Responses"."quizQuizid"=${req.params.quizid} AND "Responses"."StudentSid"=${id} `)
        res.json(quizStudentResults[0])
      }
    }).catch((err)=>{
      res.status(403).json("Token error")
    })
  })
  router.get("/courseresults/:courseid",async (req,res)=>{
    token2id(req.get("x-access-token")).then(async (id)=>{
      if(await getters.isTeacher(id)){
          courseTeacherResults = await models.sequelize.query(`SELECT * FROM "Responses" WHERE EXISTS(SELECT * FROM "quizzes" WHERE "quizzes"."quizid"="Responses"."quizQuizid" AND "quizzes"."CourseCid"=${req.params.courseid} )`)
          res.json(courseTeacherResults[0])
      }
      else{
        courseStudentResults = await models.sequelize.query(`SELECT * FROM "Responses" WHERE EXISTS(SELECT * FROM "quizzes" WHERE "quizzes"."quizid"="Responses"."quizQuizid" AND "quizzes"."CourseCid"=${req.params.courseid} ) AND "Responses"."StudentSid"=${id} `)
        res.json(courseStudentResults[0])
      }
    }).catch((err)=>{
      console.log(err)
      res.status(403).json("Token error")
    })
  })
  return router
}
