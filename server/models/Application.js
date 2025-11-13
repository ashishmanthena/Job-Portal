const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref:'Job', required:true },
  applicant: { type: mongoose.Schema.Types.ObjectId, ref:'User', required:true },
  resumeUrl: String,
  coverLetter: String,
  status: { type:String, enum:['Applied','Viewed','Shortlisted','Rejected','Hired'], default:'Applied' }
}, { timestamps:true });

module.exports = mongoose.model('Application', applicationSchema);
