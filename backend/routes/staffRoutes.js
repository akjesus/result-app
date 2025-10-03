const staffController = require('../controllers/staffController');
const express = require('express');
const router = express.Router();
const restrictTo = require('../controllers/authController').restrictTo;
const verifyToken = require('../controllers/authController').verifyToken;

router.use(verifyToken); // Protect all routes after this middleware
router.get('/', restrictTo('admin'), staffController.getAllStaff);
router.post('/', restrictTo('admin'), staffController.createStaff);
router.get('/:id', restrictTo('admin', 'staff'), staffController.getStaffById);
router.delete('/:id', restrictTo('admin'), staffController.deleteStaff);
router.patch('/:id', restrictTo('admin'), staffController.resetPassword);
router.put('/:id', restrictTo('admin'), staffController.updateStaff);



module.exports = router;