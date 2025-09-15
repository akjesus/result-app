const courseController = require("../controllers/courseController");
const express = require("express");
const router = express.Router();
const restrictTo = require("../controllers/authController").restrictTo;
const verifyToken = require("../controllers/authController").verifyToken;
router.use(verifyToken); // Protect all routes after this middleware

router.get("/", courseController.getAllCourses);
router.get("/:id", courseController.getCourseById);
router.post("/", restrictTo("admin", "superadmin"), courseController.createCourse);
router.put("/:id", restrictTo("admin", "superadmin"), courseController.updateCourse);
router.delete("/:id", restrictTo("admin", "superadmin"), courseController.deleteCourse);

module.exports = router;