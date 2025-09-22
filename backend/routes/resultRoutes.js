const router = require("express").Router();
const resultController = require("../controllers/resultController");
const verifyToken = require("../controllers/authController").verifyToken;
const restrictTo = require("../controllers/authController").restrictTo;

router.use(verifyToken); // Protect all routes after this middleware




router.get('/student', resultController.getResultsByStudent);
router.get('/course/:id', restrictTo("admin", "staff"), resultController.getResultsByCourse);
router.get('/department/:id', restrictTo("admin", "staff"), resultController.getResultsByDepartment);
router.get('/department/:deptId/level/:levelId', restrictTo("admin", "staff"), resultController.getResultsByDepartmentAndLevel);
router.get('/cgpa', restrictTo('admin', 'staff'), resultController.calculateAllCGPA);
router.get('/gpa/:id', restrictTo('admin', 'staff'), resultController.getallGPAforDepartment);

router.get('/cgpa/highest-lowest', restrictTo('admin', 'staff'), resultController.getHighestandLowestCGPA);
router.get('/cgpa/:studentId', restrictTo('admin', 'staff', 'student'), resultController.calculateCGPA);
router.post("/bulk-upload", restrictTo("admin"), resultController.bulkUploadResults);
router.get("/", restrictTo("admin", "staff"), resultController.getAllResults);
router.post("/", restrictTo("admin"), resultController.createResult);
router.get("/:id", restrictTo("admin", "staff"), resultController.getResultById);
router.put("/:id", restrictTo("admin"), resultController.updateResult);
router.delete("/:id", restrictTo("admin"), resultController.deleteResult);




module.exports = router;