const express = require('express');
const InfrastrukturController = require('../../controllers/infrastruktur/infrastrukturController');
const router = express.Router();

router.get('/', InfrastrukturController.getDataInfrastruktur);
router.post('/', InfrastrukturController.createInfrastrukturReport);

module.exports = router;
