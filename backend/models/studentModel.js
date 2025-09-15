const db = require("../config/database");
const bcrypt = require("bcrypt");

class Student {
  static async execute(query, params) {
    return db.query(query, params);
  }
  static async findByUsername(username) {
    const [rows] = await db.query(
      `SELECT * FROM students WHERE LOWER(registration_number) = ? or email = ?`,
      [username.toLowerCase(), username]
    );
    return rows[0];
  }
  static async findById(id) {
     const [rows] = await db.query("SELECT * FROM students WHERE id = ?", [id]);
        return rows.length ? rows[0] : null;
  };
    static async createStudent(firstName, lastName, email, username, password) {    
    const [result] = await db.query(
      `INSERT INTO students (first_name, last_name, email, username, password, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
      [firstName, lastName, email, username, password]
    );
    return result.insertId;
  }
  static async blockUnblockStudent(id) {
    const [result] = await db.query(
      `UPDATE students SET blocked = NOT blocked WHERE id = ?`,
      [id]  
    );
    return result.affectedRows > 0;
  }
}
module.exports = Student;