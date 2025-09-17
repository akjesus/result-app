const router = require("express").Router();
const resultController = require("../controllers/resultController");
const verifyToken = require("../controllers/authController").verifyToken;
const restrictTo = require("../controllers/authController").restrictTo;

router.use(verifyToken); // Protect all routes after this middleware


router.get("/", restrictTo("admin", "superadmin", "staff"), resultController.getAllResults);
router.get('/student', resultController.getResultsByStudent);
router.get("/:id", restrictTo("admin", "superadmin", "staff"), resultController.getResultById);
router.get('/course/:id', restrictTo("admin", "superadmin", "staff"), resultController.getResultsByCourse);
router.get('/department/:id', restrictTo("admin", "superadmin", "staff"), resultController.getResultsByDepartment);
router.get('/department/:deptId/level/:levelId', restrictTo("admin", "superadmin", "staff"), resultController.getResultsByDepartmentAndLevel);
router.post("/", restrictTo("admin", "superadmin"), resultController.createResult);
router.post("/bulk/:id", restrictTo("admin", "superadmin"), resultController.bulkUploadResults);
router.put("/:id", restrictTo("superadmin"), resultController.updateResult);
router.delete("/:id", restrictTo("superadmin"), resultController.deleteResult);



module.exports = router;