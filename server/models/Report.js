// server/models/Report.js
const mongoose = require('mongoose');

// Schema for a dynamically generated and saved report
const reportSchema = mongoose.Schema(
  {
    reportName: {
      type: String,
      required: true,
    },
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed, // Use Mixed type to store flexible JSON data
      required: true,
    },
    // You can add more fields here, like a date range for the report
    // startDate: { type: Date },
    // endDate: { type: Date },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` timestamps
  }
);

const Report = mongoose.model('Report', reportSchema);
module.exports = Report;
