const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { inviteTeamMember, getTeamMembers } = require('../controllers/teamController');

router.post('/invite', protect, inviteTeamMember);
router.get('/', protect, getTeamMembers);

module.exports = router;

