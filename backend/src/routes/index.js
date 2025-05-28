const express = require('express');
const router = express.Router();
const infrastrukturRoutes = require('./infrastruktur/infrastrukturRoute');

router.use('/infrastrukturs', infrastrukturRoutes);

module.exports = router;
