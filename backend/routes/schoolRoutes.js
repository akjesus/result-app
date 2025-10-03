const schoolController = require('../controllers/schoolController');
const express = require('express');
const router = express.Router();
const restrictTo = require('../controllers/authController').restrictTo;
const verifyToken = require('../controllers/authController').verifyToken;
router.use(verifyToken); // Protect all routes after this middleware

router.use(restrictTo('admin'));
router.post('/semesters/:id/activate', restrictTo('admin'), schoolController.activateSemester);

router.use(restrictTo( 'admin', 'staff'));
router.get('/departments', schoolController.getAllDepartments);
router.get('departments/:id', schoolController.getDepartmentById);
router.post('/departments', restrictTo('admin'), schoolController.createDepartment);
router.put('/departments/:id', restrictTo('admin'), schoolController.updateDepartment);
router.delete('/departments/:id', restrictTo('admin'), schoolController.deleteDepartment);
router.get('/faculties', schoolController.getAllFaculties);
router.get('/faculties/:id', schoolController.getFacultyById);
router.get('/sessions/:id/semesters', schoolController.getSemestersForSession);
router.get('/sessions', schoolController.getSessions);
router.get('/levels', schoolController.getLevels);






module.exports = router;