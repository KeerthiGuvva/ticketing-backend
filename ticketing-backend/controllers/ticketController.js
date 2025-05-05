const Ticket = require('../models/Ticket');

exports.createTicket = async (req, res) => {
  try {
    const { title, description } = req.body;
    const ticket = new Ticket({ title, description, createdBy: req.user.userId });
    await ticket.save();
    res.status(201).json(ticket);
  } catch {
    res.status(500).json({ error: 'Failed to create ticket' });
  }
};

exports.getTickets = async (req, res) => {
  const { status, search, page = 1, limit = 10 } = req.query;
  const query = {};

  if (status) query.status = status;
  if (search) query.title = { $regex: search, $options: 'i' };

  try {
    const tickets = await Ticket.find(query)
      .populate('createdBy assignedTo', 'name email')
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Ticket.countDocuments(query);
    res.json({ tickets, total });
  } catch {
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(ticket);
  } catch {
    res.status(500).json({ error: 'Status update failed' });
  }
};

exports.assignTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { assignedTo: req.body.userId },
      { new: true }
    );
    res.json(ticket);
  } catch {
    res.status(500).json({ error: 'Assignment failed' });
  }
};

