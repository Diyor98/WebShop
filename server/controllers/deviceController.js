const path = require('path')
const uuid = require('uuid')
const { Device } = require('../models/models')
const ApiError = require('../error/ApiError')

class DeviceController {
  async create(req, res, next) {
    try {
      const { name, price, brandId, typeId, info } = req.body
      const { img } = req.files
      let filename = uuid.v4() + '.jpg'
      img.mv(path.resolve(__dirname, '..', 'static', filename))

      const device = await Device.create({
        name,
        price,
        brandId,
        typeId,
        img: filename,
      })

      res.json(device)
    } catch (error) {
      next(ApiError.badRequest(error.message))
    }
  }
  async getAll(req, res) {}
  async getOne(req, res) {}
}

module.exports = new DeviceController()
