const Application = require('../models/Application');
const Job = require('../models/Job');

exports.applyToJob = async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;
    // resume: if multer saved file, its path: req.file.path or file URL field
    const resumeUrl = req.file ? `/uploads/${req.file.filename}` : req.body.resumeUrl;
    const existing = await Application.findOne({ job: jobId, applicant: req.user._id });
    if(existing) return res.status(400).json({message:'Already applied'});

    const appDoc = new Application({
      job: jobId,
      applicant: req.user._id,
      resumeUrl,
      coverLetter
    });
    await appDoc.save();
    res.json(appDoc);
  } catch(err) {
    console.error(err);
    res.status(500).json({message:'Server error'});
  }
};

exports.listApplications = async (req, res) => {
  try {
    if(req.user.role === 'recruiter') {
      // list apps to recruiter's jobs
      const jobs = await Job.find({ postedBy: req.user._id }).select('_id');
      const jobIds = jobs.map(j => j._id);
      const apps = await Application.find({ job: { $in: jobIds } }).populate('applicant', 'name email').populate('job', 'title');
      return res.json(apps);
    } else {
      // seeker: list own applications
      const apps = await Application.find({ applicant: req.user._id }).populate('job', 'title company');
      return res.json(apps);
    }
  } catch(err) {
    console.error(err);
    res.status(500).json({message:'Server error'});
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const appDoc = await Application.findById(id).populate('job');
    if(!appDoc) return res.status(404).json({message:'Application not found'});
    // ensure recruiter owns job
    if(String(appDoc.job.postedBy) !== String(req.user._id)) return res.status(403).json({message:'Not allowed'});
    appDoc.status = status;
    await appDoc.save();
    res.json(appDoc);
  } catch(err) {
    console.error(err);
    res.status(500).json({message:'Server error'});
  }
};
