const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/login", authController.login);
router.post("/logout", authController.adminLogout);
router.post("/refresh", authController.refreshToken);
router.get("/me", authController.getMe);

module.exports = router;
