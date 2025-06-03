import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: false
  },
  message: {
    type: String,
    required: [true, 'Message is required']
  },
  numberOfPeople: {
    type: Number,
    required: false
  },
  tourPackage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TravelPackage',
    required: false
  },
  tourPackageName: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
