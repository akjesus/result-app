const Course = require('../models/courseModel');
const db = require("../config/database");

// Get all courses with pagination
exports.getAllCourses = async (req, res) => {
  const page = parseInt(req.query.page) || 1;   
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    try {
        const courses = await Course.getAllCourses(limit, offset);
        const [[{ total }]] = await db.query('SELECT COUNT(*) as total FROM courses');
        return res.status(200).json({
            courses,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: error.message });
    }
};

// Get a single course by ID
exports.getCourseById = async (req, res) => {
    const courseId = parseInt(req.params.id);
    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        return res.status(200).json(course);
    } catch (error) {
        console.log('Error fetching course by ID:', error.message);
        return res.status(500).json({ error: error.message });
    }
};
// Create a new course
exports.createCourse = async (req, res) => {
    const { name,
            code, 
            department_id, 
            level_id,
            semester_id,
            credit_load, } = req.body;
    try {
        const newCourseId = await Course.createCourse(
            name,
            code, 
            department_id, 
            level_id,
            semester_id,
            credit_load,);
         return res.status(201).json({ message: 'Course created successfully', course_id: newCourseId });
    } catch (error) {
        console.log('Error creating course:', error.message);
        return res.status(500).json({ error: error.message });
    }
   
};
// Update an existing course
exports.updateCourse = async (req, res) => {
    const courseId = parseInt(req.params.id);
    const { department_id, 
            level_id,
            semester_id,
            name,
            code, 
            credit_load} = req.body;
    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        const updated = await Course.updateCourse(
            courseId, 
            department_id, 
            level_id,
            semester_id,
            name,
            code, 
            credit_load);
        if (!updated) {
            return res.status(500).json({ message: 'Failed to update course' });
        }
        return res.status(200).json({ message: 'Course updated successfully' });
    } catch (error) {
        console.log('Error updating course:', error.message);
        return res.status(500).json({ error: error.message });
    }
};
// Delete a course
exports.deleteCourse = async (req, res) => {
    const courseId = parseInt(req.params.id);
    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        const deleted = await Course.deleteCourse(courseId);
        if (!deleted) {
            return res.status(500).json({ message: 'Failed to delete course' });
        }
        return res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
        console.log('Error deleting course:', error);
        return res.status(500).json({ error: error });
    }
};
