module.exports = (models) => {
  let getTidFromCourse = async (cid) => {
    let sql = `SELECT "TeacherTid" FROM "Courses" WHERE cid = ?`
    let tid = await models.sequelize.query(sql, {
      replacements: [cid]
    })
    console.log(tid)
    return tid[0][0].TeacherTid
  }

  let isTeacher = async (id) => {

    let isTeacher = await models.sequelize.query(`SELECT "isTeacher" from "Users" where userid = ?`, {
      replacements: [id],
    })

    return isTeacher[0][0].isTeacher
  }

  return {
    "getTidFromCourse": getTidFromCourse,
    "isTeacher": isTeacher
  }
}