const Result = require("../models/resultModel");
const db = require("../config/database");

// Get all results with pagination
exports.getAllResults = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const department = parseInt(req.query.department) || null;
  const level = parseInt(req.query.level) || null;
  try {
    const offset = (page - 1) * limit;
        let query = `SELECT results.cat_score, results.exam_score, results.grade, students.first_name, students.last_name, 
                                courses.name AS course, semesters.name AS semester,
                                sessions.name AS session, departments.name AS department, levels.name AS level
                                FROM results
                                JOIN students ON results.registration_number = students.registration_number
                                JOIN courses ON results.course_id = courses.id
                                JOIN sessions ON results.session_id = sessions.id
                                JOIN semesters ON results.semester_id = semesters.id
                                JOIN levels ON students.level_id = levels.id
                                JOIN departments ON students.department_id = departments.id`;
        let countQuery = 'SELECT COUNT(*) as total FROM results';

        const conditions = ['results.blocked = 0'];
        const params = [];

        if (department) {
            conditions.push('departments.id = ?');
            params.push(department);
        }

        if (level) {
            conditions.push('students.level_id = ?');
            params.push(level);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
            countQuery += ' WHERE ' + conditions.join(' AND ');
        }

        // Add pagination params at the end for the main query
        query += ' LIMIT ? OFFSET ?';
        const queryParams = [...params, limit, offset];
        const [results] = await Result.execute(query, queryParams);
        // Only use filter params for count query
        const [[{ total }]] = await Result.execute(countQuery, params);

    return res.status(200).json({
        success: true, code: 200, message:"All results fetched successfully",
      results,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, code: 500, message: error.message});
  }
};


// Get a single result by ID
exports.getResultById = async (req, res) => {
    const resultId = parseInt(req.params.id);
    try {
        const result = await Result.findById(resultId);
        if (!result) {
            return res.status(404).json({ success: false, code: 404, message: 'Result not found' });
        }
        return res.status(200).json({success: true, code: 200, result});
    } catch (error) {
        console.log('Error fetching result by ID:', error.message);
        return res.status(500).json({ success: false, code: 500, message: error.message });
    }
};


// Create a new result

exports.createResult = async (req, res) => {
    const { registration_number, course_id, cat_score, exam_score, semester_id, session_id } = req.body;
    //validate inputs
    if (!registration_number || !course_id || cat_score == null || exam_score == null || !semester_id || !session_id ) {
        return res.status(400).json({ success: false, code: 400, message: "All fields are required!" });
    }

    try {
        // Check for duplicate
        const [existing] = await Result.findByStudentAndCourse(registration_number, course_id);
        if (existing && existing.length > 0) {
            return res.status(409).json({ success: false, code: 409, message: "Result for this student and course already exists!" });
        }

        const newResultId = await Result.createResult(registration_number, course_id, cat_score, exam_score, semester_id, session_id);
        return res.status(201).json({success: true, code: 201, message: 'Result created successfully', result_id: newResultId });
    }
    catch (error) {
        console.log('Error creating result:', error.message);
        return res.status(500).json({ success: false, code: 500, message: error.message });
    }
};

// Update an existing result
exports.updateResult = async (req, res) => {
    const resultId = parseInt(req.params.id);
    const { student_id, course_id, score, grade, semester_id, level_id } = req.body;
    try {
        const updated = await Result.updateResult(resultId, student_id, course_id, score, grade, semester_id, level_id);
        if (!updated) {
            return res.status(404).json({ success: false, code: 404, message: 'Result not found or no changes made' });
        }
        return res.status(200).json({ success: true, code: 200, message: 'Result updated successfully' });
    } catch (error) {
        console.log('Error updating result:', error.message);
        return res.status(500).json({ success: false, code: 500, message: error.message });
    }
};
// Delete a result
exports.deleteResult = async (req, res) => {
    const resultId = parseInt(req.params.id);
    try {
        const deleted = await Result.deleteResult(resultId);
        if (!deleted) {
            return res.status(404).json({ success: false, code: 404, message: 'Result not found' });
        }
        return res.status(200).json({ success: true, code: 200, message: 'Result deleted successfully' });
    }
    catch (error) {
        console.log('Error deleting result:', error.message);
        return res.status(500).json({ success: false, code: 500, message: error.message });
    }
};


//bulk upload results
exports.bulkUploadResults = async (req, res) => {
    const courseId = parseInt(req.params.id);
    console.log("Uploading results for course ID:", courseId);
    if (!req.files || !req.files.file) {
        return res.status(400).json({ success: false, code: 400, message: "No file uploaded!" });
    }
    
    console.log("Uploaded files:", req.files);
    const resultsFile = req.files.file;
    const {session_id, semester_id} = req.body;
    if(!session_id || !semester_id) {
        return res.status(400).json({ success: false, code: 400, message: "Session ID and Semester ID are required!" });
    }
    const fileExtension = resultsFile.name.split('.').pop().toLowerCase();
    if (fileExtension !== 'csv') {
        return res.status(400).json({ success: false, code: 400, message: "Only CSV files are allowed!" });
    }
    try {
        const csv = require('csv-parser');
        const stream = require('stream');
        const results = [];
        const readableStream = new stream.Readable();
        readableStream._read = () => {}; // _read is required but you can noop it
        readableStream.push(resultsFile.data);
        readableStream.push(null);
        readableStream.pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            // Validate and transform data
            let insertedCount = 0;
            for (const r of results) {
                const registration_number = r.registration_number;
                // Check for duplicate
                const [existing] = await Result.findByStudentAndCourse(registration_number, courseId);
                if (existing && existing.length > 0) {
                    continue; // Skip duplicate
                }
                // Insert unique result
                await Result.createResult(
                    registration_number,
                    courseId,
                    parseFloat(r.cat_score),
                    parseFloat(r.exam_score),
                    semester_id,
                    session_id,
                );
                insertedCount++;
            }
            return res.status(200).json({success: true, code: 200, message: `${insertedCount} results uploaded successfully (duplicates skipped)` });
        })
        .on('error', (err) => {
            console.log('Error parsing CSV:', err.message);
            return res.status(500).json({success: false, code: 500, message: "Error parsing CSV file" });
        }); 
    } catch (error) {
        console.log('Error uploading results:', error.message);
        return res.status(500).json({success: false, code: 500, message: error.message });
    }
};



exports.getResultsByStudent = async (req, res) => {
  try {
    const {registration_number} = req.body;
    if (!registration_number) {
        return res.status(400).json({ success: false, code: 400, message: "Registration number is required!" });
    }
    const [results] = await db.query(
      `SELECT results.id, results.course_id, courses.name AS course_name, students.first_name, 
      students.last_name, students.registration_number, results.cat_score, results.exam_score, 
      results.cat_score + results.exam_score AS total_score, results.grade,
      courses.credit_load, semesters.name as semester, sessions.name as session
             FROM results
             JOIN courses ON results.course_id = courses.id
             JOIN students ON results.registration_number = students.registration_number
             JOIN sessions ON results.session_id = sessions.id
             JOIN semesters ON results.semester_id = semesters.id
             WHERE results.registration_number = ?`,
      [registration_number]
    );
    if(results.length === 0) {
        return res.status(404).json({ success: false, code: 404, message: 'No results found for this student' });
    }
    return res.status(200).json({success: true, code: 200,results});
  } catch (err) {
    console.log(err)
    return res.status(500).json({ success: false, code: 500, message: err.message });
  }
};

exports.getResultsByDepartment = async (req, res) => {
    try {
        const departmentId = req.params.id;
        const [results] = await db.query(
            `SELECT  results.id, departments.name as department_name, courses.name AS course_name, 
            students.first_name, students.last_name, 
                    students.registration_number, results.cat_score, results.exam_score,
                    results.cat_score + results.exam_score AS total_score, results.grade,
                    courses.credit_load
             FROM results
             JOIN courses ON results.course_id = courses.id
             JOIN students ON results.registration_number = students.registration_number
             JOIN departments ON students.department_id = departments.id
             WHERE departments.id = ?`,
            [departmentId]
        );
        return res.status(200).json({success: true, code: 200, results});
    } catch (err) {
        return res.status(500).json({ success: false, code: 500, message: err.message });
    }
};

exports.getResultsByCourse = async (req, res) => {
    try {
        const courseId = req.params.id;
        const [results] = await db.query(
            `SELECT results.id,  courses.name AS course_name, students.first_name, 
            students.last_name, students.registration_number, results.cat_score, results.exam_score,
            results.cat_score + results.exam_score AS total_score, results.grade
             FROM results
             JOIN courses ON results.course_id = courses.id
             JOIN students ON results.registration_number = students.registration_number
             WHERE courses.id = ?`,
            [courseId]
        );
        return res.status(200).json({success: true, code: 200, results});
    } catch (err) {
        return res.status(500).json({success: false, code: 500, message: err.message });
    }
};


exports.getResultsByDepartmentAndLevel = async (req, res) => {
    try {
        const { deptId, levelId } = req.params;
        if (!deptId || !levelId) {
            return res.status(400).json({ error: "Department ID and Level ID are required!" });
        }
        const [results] = await db.query(
            `SELECT  results.id, departments.name as department_name, courses.name AS course_name,
            students.first_name, students.last_name, 
                    students.registration_number, results.cat_score, results.exam_score,
                    results.cat_score + results.exam_score AS total_score, results.grade,       
                    courses.credit_load
             FROM results
             JOIN courses ON results.course_id = courses.id 
                JOIN students ON results.registration_number = students.registration_number
                JOIN departments ON students.department_id = departments.id
                WHERE departments.id = ? AND students.level_id = ?`,
            [deptId, levelId]
        );
        if(results.length === 0) {
            return res.status(404).json({success: false, code: 404, message: 'No results found for this department and level' });
        }
        res.json(results);
    }   catch (err) {
        res.status(500).json({ success: false, code: 500, message: err.message });
    }
};


//block a student's result
exports.blockResult = async (req, res) => {
    const registration_number = parseInt(req.params.registration_number);
    try {
        const blocked = await Result.blockUnblockResult(registration_number);
        if (!blocked) {
            return res.status(404).json({ success: false, code: 404, message: 'Result not found or already blocked' });
        }
        return res.status(200).json({ success: true, code: 200, message: 'Result blocked successfully' });
    }
    catch (error) {
        console.log('Error blocking result:', error.message);
        return res.status(500).json({ success: false, code: 500, message: error.message });
    }
};
