let express = require('express')
const metrohash64 = require('metrohash').metrohash64;



let getStudent = (req) => {
  return 1
}

let getTeacher = (req) => {
  return 1
}

module.exports = (models) => {

  let router = express.Router()

  router.get('/listgroups', (req, res) => {
    models.Courses.findAll({
      attributes: ["cid"]
    }).then((result) => {
      res.json(result)
    })
  })

  router.get("/getcourse/:id", (req, res) => {
    models.Course.findOne({
      where: {
        cid: req.params.id
      }
    }).then(result => {
      res.json(result);
    }).catch((err) => {
      models.sequelize.query(sql).then(([result, metadata]) => {
        res.json(result)
      }).catch((err) => {
        res.json("There has been an error")
      })
      if (err.errors) res.json(err.errors[0].message)
    })
  })

  router.post("/createcourse", (req, res) => {
    let teacher = getTeacher(req)

    models.Course.findAll({
      limit: 1,
      order: [['cid', 'DESC']]
    }).then((entry) => {
      let cid = entry[0].cid;
      let hash = metrohash64(cname + cid.toString(), teacher)

      models.course.create({
        cname: req.body.cname,
        joinKey: hash,
        TeacherTid: teacher
      }).then((result) => {
        res.json(result)
      }).catch((err) => {
        if (err.errors) res.json(err.errors[0].message);
      })
    })
  })

  router.post("/joincourse", (req, res) => {
    let student = getStudent(req)

    models.Course.findOne({
      where: {
        joinKey: req.body.key,
      }
    }).then((course) => {
      sql = `INSERT INTO "StudentCourse"("CourseCid", "StudentSid") VALUES(${course.cid}, ${student}) RETURNING *`
      models.sequelize.query(sql).then(([result, metadata]) => {
        res.json(result)
      }).catch((err) => {
        res.json("There has been an error")
      })
    })
  })



  return router
}

