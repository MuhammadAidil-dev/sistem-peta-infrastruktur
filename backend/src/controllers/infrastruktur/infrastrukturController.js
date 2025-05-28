const Infrastruktur = require('../../models/infrastruktur');

const InfrastrukturController = {
  getDataInfrastruktur: async (req, res, next) => {
    try {
      const allData = await Infrastruktur.findAll();

      return res.json({
        status: 'success',
        message: 'berhasil mengambil data',
        data: allData,
      });
    } catch (error) {
      return next(error);
    }
  },
  createInfrastrukturReport: async (req, res, next) => {
    try {
      const payload = req.body;

      const report = await Infrastruktur.create(payload);

      return res.status(201).json({
        status: 'success',
        message: 'berhasil menambahkan data report',
        data: report,
      });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = InfrastrukturController;
