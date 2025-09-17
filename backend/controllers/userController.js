const Student = require("../models/studentModel");
const Staff = require("../models/staffModel");
const bcrypt = require("bcrypt");

//get all users from the sql database and paginate the results

exports.getAllUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const department = parseInt(req.query.department) || null;
  const level = parseInt(req.query.level) || null;
  try {
    const offset = (page - 1) * limit;
    let query = 'SELECT * FROM students';
    let countQuery = 'SELECT COUNT(*) as total FROM students';

    const conditions = ['blocked = 0'];
    const params = [];

    if (department) {
      conditions.push('department_id = ?');
      params.push(department);
    }

    if (level) {
      conditions.push('level_id = ?');
      params.push(level);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
      countQuery += ' WHERE ' + conditions.join(' AND ');
    }

    // Add pagination params at the end for the main query
    query += ' LIMIT ? OFFSET ?';
    const queryParams = [...params, limit, offset];
    const [users] = await Student.execute(query, queryParams);
    // Only use filter params for count query
    const [[{ total }]] = await Student.execute(countQuery, params);

    return res.status(200).json({success: true, code: 500,
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, code: 500, message: error });
  }
}


exports.getUserById = async (req, res) => {
  const userId = parseInt(req.params.id);
    try {
        const user = await Student.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, code: 404, message: 'User not found' });
        }   
        return res.status(200).json({success: true, code: 200, user});
    } catch (error) {
        console.log('Error fetching user by ID:', error);
        return res.status(500).json({ success: false, code: 500, message: error.message });
    }
};


exports.createUser = async (req, res) => {
    console.log("here", req.body)
    try {
         
      const { firstName, lastName, email, username, password, role, department, level } = req.body;
       
      if (!firstName || !lastName || !email || !username || !password || !role) {
        return res.status(400).json({ success: false, code: 400, message: "All fields are required!" });
      }

      if (role === 'student') {
        if (!department || !level) {
          return res.status(400).json({ success: false, code: 400, message:  "Department and level are required for students!" });
        }
        const studentId = await Student.createStudent(firstName, lastName, email, username, password, department, level);
        return res.status(201).json({ success: true, code: 201, message:  "Student created successfully", id: studentId });
      }

      const staffId = await Staff.createStaff(firstName, lastName, email, username, password);
      res.status(201).json({ success: true, code: 201, message:  "Staff created successfully", id: staffId});
    } catch (err) {
      res.status(500).json({ success: false, code: 500, message:  err.message });
    }
  };


exports.resetPassword = async (req, res) => {
    try {
      const { id} = req.params;
        if ( !id ) {
            return res.status(400).json({ success: false, code: 400, message: "ID required!" });
        }
        // Implement password reset logic here
        const user = await Student.findById(id) || await Staff.findByUsername(id);
        if (!user) {
            return res.status(404).json({ success: false, code: 404, message: "User not found!" });
        }
        const newPassword = await bcrypt.hash("password", 10);
        let table = user.role === 'student' ? 'students' : 'staff';
        let Model = user.role === 'student' ? Student : Staff;

        await Model.execute(`UPDATE ${table} SET password = ? WHERE id = ?`, [newPassword, user.id]);

        res.status(200).json({ success: true, code: 200, message:  "Password reset successful" });
    } catch (err) {
      res.status(500).json({ success: false, code: 500, message:  err.message });
    }
};


exports.deleteUser = async (req, res) => {
    const userId = parseInt(req.params.id);
    try {   
        const user = await Student.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, code: 404, message:  'User not found' });
        }
        await Student.execute('DELETE FROM students WHERE id = ?', [userId]);
        return res.status(200).json({ success: true, code: 200, message:  'User deleted successfully' });
    } catch (error) {
        console.log('Error deleting user:', error);
        return res.status(500).json({ success: false, code: 500, message:  error });
    }
};


exports.updateUser = async (req, res) => {
    const userId = parseInt(req.params.id);
    const { firstName, lastName, email, username, role, department, level } = req.body; 
    let table = role === 'student' ? 'students' : 'staff';
    try {
        const user = await Student.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, code: 404, message:'User not found' });
        }
        await Student.execute(`
            UPDATE ${table} 
            SET first_name = ?, 
            last_name = ?, 
            email = ?, 
            username = ?,
            department_id = ?,
            level_id = ? 
            WHERE id = ?`, 
        [firstName, lastName, email, username, department, level, userId]);  
        return res.status(200).json({ success: true, code: 200, message:'User updated successfully', user }); 
    } catch (error) {
        console.log('Error updating user:', error);
        return res.status(500).json({ success: false, code: 500, message:error });
    }
};

exports.blockUser = async (req, res) => {
    const userId = parseInt(req.params.id);
    try {
        const user = await Student.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, code: 500, message: 'User not found' });
        }
        await Student.blockUnblockStudent(userId);
        const message = user.blocked ? 'User unblocked successfully' : 'User blocked successfully';
        return res.status(200).json({ success: true, code: 200,  message });
    } catch (error) {
        console.log('Error blocking user:', error);
        return res.status(500).json({ success: false, code: 500, message: error.message });
    }
};


