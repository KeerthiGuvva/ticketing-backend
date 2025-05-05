const express = require('express');
const router = express.Router();
const {
  createTicket,
  getTickets,
  updateStatus,
  assignTicket,
} = require('../controllers/ticketController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createTicket);
router.get('/', protect, getTickets);
router.patch('/:id/status', protect, updateStatus);
router.patch('/:id/assign', protect, assignTicket);

module.exports = router;

