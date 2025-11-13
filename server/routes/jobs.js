const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const jobCtrl = require('../controllers/jobController');

router.get('/', jobCtrl.listJobs);
router.get('/:id', jobCtrl.getJob);
router.post('/', auth, jobCtrl.createJob); // only authenticated recruiters should use (frontend will enforce role)
router.put('/:id', auth, jobCtrl.updateJob);
router.delete('/:id', auth, jobCtrl.deleteJob);

module.exports = router;
