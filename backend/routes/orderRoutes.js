const express = require('express');
const router = express.Router();

// Import controller functions
const { 
  addOrderItems, 
  getMyOrders, 
  getOrders, 
  updateOrderStatus 
} = require('../controllers/orderController.js');

// Import middleware
const { protect, admin } = require('../middleware/authMiddleware.js');

// --- Customer Routes ---
router.post('/', protect, addOrderItems);
router.get('/myorders', protect, getMyOrders);

// --- Admin Routes ---
router.get('/', protect, admin, getOrders);
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;