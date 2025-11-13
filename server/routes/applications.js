const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const appCtrl = require('../controllers/applicationController');

// multer local storage (dev)
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function(req, file, cb) {
    const name = Date.now() + '-' + file.originalname.replace(/\s+/g, '-');
    cb(null, name);
  }
});
const upload = multer({ storage });

router.post('/', auth, upload.single('resume'), appCtrl.applyToJob);
router.get('/', auth, appCtrl.listApplications);
router.put('/:id/status', auth, appCtrl.updateStatus);

module.exports = router;
