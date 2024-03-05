import { Service } from '../models/serviceModel.js';

const serviceController = {
  /********************************************************************************
   * @description get all services in db
   * @route /api/services
   * @method GET
   * @returns {Service[]}an array of all service objects from DB
   *******************************************************************************/
  getAllServices: async (req, res) => {
    const services = await Service.find({});
    return res.status(200).json(services);
  },

  /********************************************************************************
   * @description get one service by _id
   * @route /api/services/:id
   * @method GET
   * @returns {Service}, service. currently gets all info
   *******************************************************************************/
  getServiceById: async (req, res) => {
    const { id } = req.params;
    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).send('service not found');
    }
    return res.status(200).json(service);
  },

  /********************************************************************************
   * @description edit one service by _id
   * @route /api/services/:id
   * @method PUT
   * @returns {Service}, service. the updated service
   *******************************************************************************/
  updateServiceById: async (req, res) => {
    const { id } = req.params;
    const service = await Service.findByIdAndUpdate(id, req.body, { new: true });
    return res.status(200).json(service);
  },

  /********************************************************************************
   * @description delete one service by _id
   * @route /api/services/:id
   * @method DELETE
   * @returns {Service}, service. the deleted service
   *******************************************************************************/
  deleteServiceById: async (req, res) => {
    const { id } = req.params;
    const service = await Service.findByIdAndDelete(id);
    return res.status(200).json(service);
  },
};

export default serviceController;
