import Contact from '../models/Contact.js';
import catchAsync from '../utils/catchAsync.js';

// Create a new contact submission
export const createContact = catchAsync(async (req, res) => {
  const { fullName, email, phone, message, destination, tourPackage, tourPackageName } = req.body;

  // Create new contact entry
  const contact = await Contact.create({
    fullName,
    email,
    phone,
    message,
    destination,
    tourPackage,
    tourPackageName,
    createdAt: new Date()
  });

  res.status(201).json({
    status: 'success',
    data: contact
  });
});

// Get all contact submissions (for admin dashboard)
export const getAllContacts = catchAsync(async (req, res) => {
  const contacts = await Contact.find().sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: contacts.length,
    data: contacts
  });
});

// Get contact by ID
export const getContactById = catchAsync(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return res.status(404).json({
      status: 'fail',
      message: 'Contact submission not found'
    });
  }

  res.status(200).json({
    status: 'success',
    data: contact
  });
});

// Delete contact submission
export const deleteContact = catchAsync(async (req, res) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);

  if (!contact) {
    return res.status(404).json({
      status: 'fail',
      message: 'Contact submission not found'
    });
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});
