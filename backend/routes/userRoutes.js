const express = require("express");
const router = express.Router();
const restrictTo = require("../controllers/authController").restrictTo;
const verifyToken = require("../controllers/authController").verifyToken;
router.use(verifyToken); // Protect all routes after this middleware


const userController = require("../controllers/userController");
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.post("/", restrictTo("admin", "superadmin"), userController.createUser);
router.post("/:id/reset-password",restrictTo('admin', 'superadmin'), userController.resetPassword);
router.put("/:id", restrictTo("admin", "superadmin"), userController.updateUser);
router.delete("/:id", restrictTo("admin", "superadmin"), userController.deleteUser);
router.post("/:id/block", restrictTo("admin", "superadmin"), userController.blockUser);

module.exports = router;
