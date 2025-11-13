const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  description: String,
  skills: [String],
  salary: String,
  employmentType: { type:String, enum:['Full-time','Part-time','Contract','Internship'] },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref:'User' },
  isActive: { type:Boolean, default:true }
}, { timestamps:true });

module.exports = mongoose.model('Job', jobSchema);
