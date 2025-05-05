const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Ticket = require('../models/Ticket');

router.get('/summary', protect, async (req, res) => {
  try {
    const userId = req.user.userId;
    const role = req.user.role;

    // For admins: get all tickets they created or their team created
    const query = role === 'admin'
      ? { $or: [{ createdBy: userId }, { createdBy: { $in: await getTeamIds(userId) } }] }
      : { createdBy: userId };

    const tickets = await Ticket.find(query);

    const total = tickets.length;
    const resolved = tickets.filter(t => t.status === 'resolved').length;
    const open = tickets.filter(t => t.status === 'open').length;
    const inProgress = tickets.filter(t => t.status === 'in-progress').length;

    res.json({ total, resolved, open, inProgress });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Helper function
async function getTeamIds(adminId) {
  const User = require('../models/User');
  const team = await User.find({ invitedBy: adminId }).select('_id');
  return team.map(u => u._id);
}

module.exports = router;
