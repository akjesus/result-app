const schoolController = require('../controllers/schoolController');
const express = require('express');
const router = express.Router();
const restrictTo = require('../controllers/authController').restrictTo;
const verifyToken = require('../controllers/authController').verifyToken;
router.use(verifyToken); // Protect all routes after this middleware

router.get('/departments', restrictTo('admin', 'superadmin', 'staff'), schoolController.getAllDepartments);
router.get('departments/:id', restrictTo('admin', 'superadmin', 'staff'), schoolController.getDepartmentById);
router.post('/departments', restrictTo('admin', 'superadmin'), schoolController.createDepartment);
router.put('/departments/:id', restrictTo('admin', 'superadmin'), schoolController.updateDepartment);
router.delete('/departments/:id', restrictTo('superadmin'), schoolController.deleteDepartment);
router.get('/faculties', restrictTo('admin', 'superadmin', 'staff'), schoolController.getAllFaculties);
router.get('/faculties/:id', restrictTo('admin', 'superadmin', 'staff'), schoolController.getFacultyById);




module.exports = router;