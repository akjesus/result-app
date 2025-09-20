const router = require("express").Router();
const resultController = require("../controllers/resultController");
const verifyToken = require("../controllers/authController").verifyToken;
const restrictTo = require("../controllers/authController").restrictTo;

router.use(verifyToken); // Protect all routes after this middleware




router.get('/student', resultController.getResultsByStudent);
router.get('/course/:id', restrictTo("admin", "superadmin", "staff"), resultController.getResultsByCourse);
router.get('/department/:id', restrictTo("admin", "superadmin", "staff"), resultController.getResultsByDepartment);
router.get('/department/:deptId/level/:levelId', restrictTo("admin", "superadmin", "staff"), resultController.getResultsByDepartmentAndLevel);
router.get('/cgpa', restrictTo('admin', 'superadmin', 'staff'), resultController.calculateAllCGPA);
router.get('/cgpa/highest-lowest', restrictTo('admin', 'superadmin', 'staff'), resultController.getHighestandLowestCGPA);
router.get('/cgpa/:studentId', restrictTo('admin', 'superadmin', 'staff', 'student'), resultController.calculateCGPA);
router.post("/bulk/:id", restrictTo("admin", "superadmin"), resultController.bulkUploadResults);
router.get("/", restrictTo("admin", "superadmin", "staff"), resultController.getAllResults);
router.post("/", restrictTo("admin", "superadmin"), resultController.createResult);
router.get("/:id", restrictTo("admin", "superadmin", "staff"), resultController.getResultById);
router.put("/:id", restrictTo("superadmin"), resultController.updateResult);
router.delete("/:id", restrictTo("superadmin"), resultController.deleteResult);




module.exports = router;