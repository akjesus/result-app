const schoolController = require('../controllers/schoolController');
const express = require('express');
const router = express.Router();
const restrictTo = require('../controllers/authController').restrictTo;
const verifyToken = require('../controllers/authController').verifyToken;
router.use(verifyToken); // Protect all routes after this middleware

router.get('/departments', restrictTo('admin', 'staff'), schoolController.getAllDepartments);
router.get('departments/:id', restrictTo('admin', 'staff'), schoolController.getDepartmentById);
router.post('/departments', restrictTo('admin'), schoolController.createDepartment);
router.put('/departments/:id', restrictTo('admin'), schoolController.updateDepartment);
router.delete('/departments/:id', restrictTo('admin'), schoolController.deleteDepartment);
router.get('/faculties', restrictTo('admin', 'staff'), schoolController.getAllFaculties);
router.get('/faculties/:id', restrictTo('admin', 'staff'), schoolController.getFacultyById);
router.get('/sessions', restrictTo('admin', 'staff', "student"), schoolController.getSessions);
router.get('/levels', restrictTo('admin', 'staff', "student"), schoolController.getLevels);





module.exports = router;