import express from 'express';
import Ticket from '../models/Ticket.js';
import { authMiddleware } from '../config/authMiddleware.js';

const router = express.Router();

// Endpoint to create a ticket from the widget
router.post('/create-ticket', authMiddleware, async (req, res) => {
  const { title, description, priority } = req.body;

  try {
    // Ensure the required fields are provided
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    // Create the ticket
    const newTicket = new Ticket({
      title,
      description,
      priority: priority || 'low', // Default priority is 'low'
      createdBy: req.user.id, // The ticket is created by the authenticated user
    });

    await newTicket.save();
    res.status(201).json({ message: 'Ticket created successfully', ticket: newTicket });
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Endpoint to get widget settings (e.g., appearance, features)
router.get('/settings', async (req, res) => {
  try {
    // Fetch widget settings (these could be stored in the database or a config file)
    const widgetSettings = {
      color: '#4CAF50', // Green color for the widget
      position: 'bottom-right', // Widget position (can be top-right, bottom-left, etc.)
      theme: 'dark', // Theme options (dark/light)
    };

    res.json(widgetSettings);
  } catch (error) {
    console.error('Error fetching widget settings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
