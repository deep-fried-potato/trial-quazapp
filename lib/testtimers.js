module.exports = (models) => {
  let testEndTimer = async (quizid) => {
    let sql = `SELECT endtime from "quiz" where quizid=${quizid}`
    let endtime = await models.sequalize.query(sql)
    console.log(time);
  }
  return {
    'testEndTimer': testEndTimer,
  }
}