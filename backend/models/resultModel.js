const db = require("../config/database");


class Result {
  static async findById(id) {
    const [rows] = await db.query("SELECT * FROM results WHERE id = ?", [id]);
    return rows.length ? rows[0] : null;
  }
    static async createResult(student_id, course_id, score, grade, semester_id, session_id, level_id) {
    const [result] = await db.query(
        `INSERT INTO results
        (student_id, course_id, score, grade, semester_id, session_id, level_id, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [student_id, course_id, score, grade, semester_id, session_id, level_id]
    );
    return result.insertId;
  }
    static async getAllResults(limit, offset) {
    const [result ] = await db.query(`
        SELECT *
        FROM results
        LIMIT ?
        OFFSET ?
    `, [limit, offset]);
    return result;
  }
    static async getResultsByStudentId(studentId) {
    const [rows] = await db.query("SELECT * FROM results WHERE student_id = ?", [studentId]);
    return rows;
  }
    static async updateResult(resultId, student_id, course_id, score, grade, semester_id, level_id) {
    const [result] = await db.query(
      `UPDATE results 
       SET student_id = ?, course_id = ?, score = ?, grade = ?, semester_id = ?, level_id = ? WHERE id = ?`,    
            [student_id, course_id, score, grade, semester_id, level_id, resultId]
    );
    return result.affectedRows > 0;
  }
    static async deleteResult(resultId) {
    const [result] = await db.query("DELETE FROM results WHERE id = ?", [resultId]);
    return result.affectedRows > 0;
  }
  static async getResultsByCourseId(courseId) {
    const [rows] = await db.query("SELECT * FROM results WHERE course_id = ?", [courseId]);
    return rows;
  }
  static async getResultByDepartment(departmentId) {
    const [rows] = await db.query(`
      SELECT r.*
      FROM results r    
        JOIN courses c ON r.course_id = c.id
        WHERE c.department_id = ?`, [departmentId]);
    return rows;
    }

}
module.exports = Result;