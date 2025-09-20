// models/Admin.js
const db = require("../config/database");
const bcrypt = require("bcrypt");

class Staff {
  static async findByUsername(username) {
    const [rows] = await db.query("SELECT * FROM staff WHERE username = ?", [username]);
    return rows.length ? rows[0] : null;
  }
static async findById(id) {
    const [rows] = await db.query("SELECT * FROM staff WHERE id = ?", [id]);
    return rows.length ? rows[0] : null;
  }
  static async createStaff(firstName, lastName, email, username, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      `INSERT INTO staff (role, first_name, last_name, email, username, password, created_at, updated_at)
       VALUES ('staff', ?, ?, ?, ?, ?, NOW(), NOW())`,
      [firstName, lastName, email, username, hashedPassword]
    );
    return result.insertId;
  }
  static async getAllStaff(limit, offset) {
    const [result ] = await db.query(`
      SELECT *
      FROM users
      LIMIT ?
      OFFSET ?
    `, [limit, offset]);
    return result;
  }
}



module.exports = Staff;
