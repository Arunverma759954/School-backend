import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, default: 'School Campus' },
    description: { type: String },
    category: { type: String, default: 'General' },
    link: { type: String }
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);

const enquirySchema = new mongoose.Schema({
    parentName: { type: String, required: true },
    studentName: { type: String, required: true },
    email: { type: String },
    phone: { type: String, required: true },
    classApplying: { type: String, required: true },
    message: { type: String },
    status: { type: String, enum: ['New', 'Contacted', 'Resolved'], default: 'New' }
}, { timestamps: true });

const Enquiry = mongoose.model('Enquiry', enquirySchema);

const tcSchema = new mongoose.Schema({
    studentName: { type: String, required: true },
    admissionNo: { type: String, required: true, unique: true },
    issueDate: { type: Date, required: true },
    className: { type: String, required: true },
    tcNumber: { type: String, required: true, unique: true },
    imageFile: { type: String }, // Path to the student photo
    pdfUrl: { type: String } // Path to the TC document
}, { timestamps: true });

const TC = mongoose.model('TC', tcSchema);

export { Event, Enquiry, TC };
