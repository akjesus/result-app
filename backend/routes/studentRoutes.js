const express = require("express");
const router = express.Router();
const restrictTo = require("../controllers/authController").restrictTo;
const verifyToken = require("../controllers/authController").verifyToken;
const studentController = require("../controllers/studentController");
const {getResultsByStudent, getAllResultsForStudent} = require("../controllers/resultController");
const { changeStudentPassword } = require("../controllers/authController")


router.use(verifyToken);
router.get("/profile", studentController.getMyProfile);
router.get("/result", getResultsByStudent);
router.get("/all-results", getAllResultsForStudent);
router.post("/change-password", changeStudentPassword);

router.use(restrictTo("admin", "superadmin", "staff"))
router.post("/bulk-upload", studentController.bulkUploadStudents);
router.get("/bulk-download", studentController.bulkDownloadStudents);

router.get("/", studentController.getAllStudents);
router.get("/:id", studentController.getUserById);
router.post("/",  studentController.createStudent);
router.post("/:id/reset-password", studentController.resetPassword);
router.put("/:id",  studentController.updateUser);
router.delete("/:id",  studentController.deleteUser);
router.post("/:id/block",  studentController.blockUser);

module.exports = router;
