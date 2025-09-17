const db = require("../config/database");


class Result {
  // Calculate grade based on 5 Point GPA System
  static calculateGrade(totalScore) {
    if (totalScore >= 70) return 'A'; // 5.0
    if (totalScore >= 60) return 'B'; // 4.0
    if (totalScore >= 50) return 'C'; // 3.0
    if (totalScore >= 45) return 'D'; // 2.0
    if (totalScore >= 40) return 'E'; // 1.0
    return 'F'; // 0.0
  }
  static async findByStudentAndCourse(registration_number, course_id) {
    return db.query("SELECT * FROM results WHERE registration_number = ? AND course_id = ?", [registration_number, course_id]);
  }
  static async execute(query, params) {
      return db.query(query, params);
    }
  static async findById(id) {
    const [rows] = await db.query("SELECT * FROM results WHERE id = ?", [id]);
    return rows.length ? rows[0] : null;
  }
  
  static async createResult(registration_number, course_id, cat_score, exam_score, semester_id, session_id) {
      const totalScore = Number(cat_score) + Number(exam_score);
      const grade = Result.calculateGrade(totalScore);
      try {
        const [result] = await db.query(
          `INSERT INTO results
          (registration_number, course_id, cat_score, exam_score, semester_id, session_id, grade, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [registration_number, course_id, cat_score, exam_score, semester_id, session_id, grade]
      );
      return result.insertId;
      }
      catch(error) {
        console.log("Error creating result:", error); 
          return null;
       }

      
    }
    
  static async getResultsByStudentId(registration_number) {
    const [rows] = await db.query("SELECT * FROM results WHERE registration_number = ?", [registration_number]);
    return rows;
  }
  
  static async updateResult(resultId, registration_number, course_id, score, grade, semester_id, level_id) {
    const [result] = await db.query(
      `UPDATE results 
       SET registration_number = ?, course_id = ?, score = ?, grade = ?, semester_id = ?, level_id = ? WHERE id = ?`,    
            [registration_number, course_id, score, grade, semester_id, level_id, resultId]
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
//get result by student matching course id to course table
  static async getResultsByStudentAndCourse(studentId, courseId) {
    const [rows] = await db.query("SELECT * FROM results WHERE student_id = ? AND course_id = ?", [studentId, courseId]);
    return rows;
  }

  //bulk upload results by course id
  static async bulkUploadResults(results) {
      const values = results.map(result => {
        const totalScore = Number(result.cat_score) + Number(result.exam_score);
        const grade = Result.calculateGrade(totalScore);
        return [
          result.registration_number,
          result.course_id,
          result.cat_score,
          result.exam_score,
          result.semester_id,
          result.session_id,
          grade,
          new Date(),
          new Date()
        ];
      });
      try {
        const [res] = await db.query(
        `INSERT INTO results 
        (registration_number, course_id, cat_score, exam_score, semester_id, session_id, grade, created_at, updated_at)  
           VALUES ?`,
          [values]
      );
      return res.affectedRows;
      }
      catch (error) {
        console.log("Error during bulk upload:", error);
        return 0;
      }
      
    }
  static async blockUnblockResult(registration_number) {
        const [result] = await db.query(
          `UPDATE results SET blocked = NOT blocked WHERE id = ?`,
          [registration_number]  
        );
        return result.affectedRows > 0;
      }

}
module.exports = Result;