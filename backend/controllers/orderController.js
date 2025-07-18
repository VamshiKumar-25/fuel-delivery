const Order = require('../models/Order.js');
const FuelType = require('../models/FuelType.js');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (Customer)
const addOrderItems = async (req, res) => {
  const { fuelTypeId, quantity, deliveryAddress, deliveryDate } = req.body;

  try {
    const fuelType = await FuelType.findById(fuelTypeId);

    if (!fuelType) {
      return res.status(404).json({ message: 'Fuel type not found' });
    }

    const totalPrice = quantity * fuelType.pricePerUnit;

    const order = new Order({
      customer: req.user._id, // From 'protect' middleware
      fuelType: fuelTypeId,
      quantity,
      totalPrice,
      deliveryAddress,
      deliveryDate,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
// @access  Private (Customer)
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id }).populate('fuelType', 'name unit');
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};


// --- ADMIN ONLY FUNCTIONS ---

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
    try {
      const orders = await Order.find({}).populate('customer', 'id fullName');
      res.json(orders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };
  
// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
  
      if (order) {
        order.status = req.body.status || order.status;
        const updatedOrder = await order.save();
        res.json(updatedOrder);
      } else {
        res.status(404).json({ message: 'Order not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: error.message });
    }
};


module.exports = { 
    addOrderItems, 
    getMyOrders,
    getOrders,
    updateOrderStatus
};