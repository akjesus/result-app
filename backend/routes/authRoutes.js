const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const restrictTo = require("../controllers/authController").restrictTo;
const verifyToken = require("../controllers/authController").verifyToken;


router.post("/login", authController.login);
router.post("/create-admin", authController.createAdmin);
// Protect all routes after this middleware
router.use(verifyToken); 
router.post("/logout", authController.adminLogout);
router.post("/refresh", authController.refreshToken);
router.get("/me", authController.getMe);

// All routes after this middleware are restricted to Super Admin
router.use(restrictTo("superadmin"));

router.post("/reset-password", authController.resetPassword)

module.exports = router;
