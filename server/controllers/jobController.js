const Job = require('../models/Job');

exports.createJob = async (req, res) => {
  try {
    const data = req.body;
    data.postedBy = req.user._id;
    const job = new Job(data);
    await job.save();
    res.json(job);
  } catch(err) {
    console.error(err);
    res.status(500).json({message:'Server error'});
  }
};

exports.listJobs = async (req, res) => {
  try {
    const { page=1, limit=30, title, skills, location, employmentType } = req.query;
    const filter = {};
    if(title) filter.title = new RegExp(title, 'i');
    if(location) filter.location = new RegExp(location, 'i');
    if(employmentType) filter.employmentType = employmentType;
    if(skills) filter.skills = { $all: skills.split(',').map(s => s.trim()) };

    const jobs = await Job.find(filter)
      .skip((page-1)*limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })
      .populate('postedBy', 'name company');
    res.json(jobs);
  } catch(err) {
    console.error(err);
    res.status(500).json({message:'Server error'});
  }
};

exports.getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name company');
    if(!job) return res.status(404).json({message:'Job not found'});
    res.json(job);
  } catch(err) {
    console.error(err);
    res.status(500).json({message:'Server error'});
  }
};

exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if(!job) return res.status(404).json({message:'Job not found'});
    if(String(job.postedBy) !== String(req.user._id)) return res.status(403).json({message:'Not allowed'});
    Object.assign(job, req.body);
    await job.save();
    res.json(job);
  } catch(err) {
    console.error(err);
    res.status(500).json({message:'Server error'});
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if(!job) return res.status(404).json({message:'Job not found'});
    if(String(job.postedBy) !== String(req.user._id)) return res.status(403).json({message:'Not allowed'});
    await job.remove();
    res.json({message:'Deleted'});
  } catch(err) {
    console.error(err);
    res.status(500).json({message:'Server error'});
  }
};
