const Department = require("../models/departmentModel");
const Faculty = require("../models/facultyModel")
const db = require("../config/database");

// Get all departments
exports.getAllDepartments = async (req, res) => {
    try {
        const departments = await Department.getAllDepartments();
        return res.status(200).json({ success: true, code: 200, departments });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, code: 500, message: error.message });
    }       
};

exports.getAllFaculties = async (req, res) => {
    try {
        const faculties = await Faculty.getAllFaculties();
        return res.status(200).json({ success: true, code: 200, faculties });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, code: 500, message: error.message });
    }       
};

// Get a single department by ID
exports.getDepartmentById = async (req, res) => {
    const departmentId = parseInt(req.params.id);
    try {
        const department = await Department.findById(departmentId);
        if (!department) {
            return res.status(404).json({ success: false, code: 404, message: 'Department not found' });
        }
        return res.status(200).json({ success: true, code: 200, department });
    } catch (error) {
        console.log('Error fetching department by ID:', error);
        return res.status(500).json({ success: false, code: 500, message: error.message });
    }
};


exports.getFacultyById = async (req, res) => {
    const facultyId = parseInt(req.params.id);
    try {
        const faculty = await Faculty.findById(facultyId);
        if (!faculty) {
            return res.status(404).json({ success: false, code: 404, message: 'Faculty not found' });
        }
        return res.status(200).json({ success: true, code: 200, faculty });
    } catch (error) {
        console.log('Error fetching faculty by ID:', error);
        return res.status(500).json({ success: false, code: 500, message: error.message });
    }
};
// Create a new department
exports.createDepartment = async (req, res) => {
    try {
        const { name, faculty_id } = req.body;
        if (!name || !faculty_id) {
            return res.status(400).json({ success: false, code: 400, message: 'Department / Faculty name is required' });
        }
        const departmentId = await Department.createDepartment(name, faculty_id);
        const newDepartment = await Department.findById(departmentId);
        return res.status(201).json({ success: true, code: 201, message: 'Department created successfully', department: newDepartment });
    }
    catch (error) {
        console.log('Error creating department:', error.message);
        return res.status(500).json({ success: false, code: 500, message: error.message });
    }
};
// Update an existing department
exports.updateDepartment = async (req, res) => {
    const departmentId = parseInt(req.params.id);
    const { name, faculty_id } = req.body;
    try {
        const department = await Department.findById(departmentId);
        if (!department) {
            return res.status(404).json({ success: false, code: 404, message: 'Department not found' });
        }
        if (!name || !faculty_id) {
            return res.status(400).json({ success: false, code: 400, message: 'Department / Faculty name is required' });
        }
        const updated = await Department.updateDepartment(departmentId, name, faculty_id);
        if (updated) {
            const updatedDepartment = await Department.findById(departmentId);
            return res.status(200).json({ success: true, code: 200, message: 'Department updated successfully', department: updatedDepartment });
        } else {
            return res.status(500).json({ success: false, code: 500, message: 'Failed to update department' });
        }
    } catch (error) {
        console.log('Error updating department:', error);
        return res.status(500).json({ success: false, code: 500, message: error.message });
    }
}
// Delete a department
exports.deleteDepartment = async (req, res) => {
    const departmentId = parseInt(req.params.id);
    try {
        const department = await Department.findById(departmentId);
        if (!department) {
            return res.status(404).json({ success: false, code: 404, message: 'Department not found' });
        }
        const deleted = await Department.deleteDepartment(departmentId);
        if (deleted) {
            return res.status(200).json({ success: true, code: 200, message: 'Department deleted successfully' });
        } else {
            return res.status(500).json({ success: false, code: 500, message: 'Failed to delete department' });
        }
    } catch (error) {
        console.log('Error deleting department:', error);
        return res.status(500).json({ success: false, code: 500, message: error.message });
    }
};

