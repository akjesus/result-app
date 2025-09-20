const reportController = require('../controllers/reportController');
const express = require('express');
const router = express.Router();
const restrictTo = require('../controllers/authController').restrictTo;
const verifyToken = require('../controllers/authController').verifyToken;
router.use(verifyToken); // Protect all routes after this middleware


// router.get('/department/:deptId/level/:levelId', restrictTo('admin', 'superadmin', 'staff'), reportController.getReportByDepartmentAndLevel);
// router.get('/faculty/:facultyId', restrictTo('admin', 'superadmin', 'staff'), reportController.getReportByFaculty);
// router.get('/school', restrictTo('admin', 'superadmin', 'staff'), reportController.getReportBySchool);
router.get('/course/:courseId', restrictTo('admin', 'superadmin', 'staff'), reportController.getGradeDistributionByCourse);
// router.get('/level/:levelId', restrictTo('admin', 'superadmin', 'staff'), reportController.getReportByLevel);
// router.get('/student/grade/:grade', restrictTo('admin', 'superadmin', 'staff'), reportController.getStudentResultsByGrade);

module.exports = router;