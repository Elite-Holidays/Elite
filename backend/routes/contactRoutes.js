import express from 'express';
import { createContact, getAllContacts, getContactById, deleteContact } from '../controllers/contactController.js';

const router = express.Router();

// Contact form submission route
router.post('/', createContact);

// Admin routes for managing contact submissions
router.get('/', getAllContacts);
router.get('/:id', getContactById);
router.delete('/:id', deleteContact);

export default router;
