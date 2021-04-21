const path = require('path')
const uuid = require('uuid')
const { Device, DeviceInfo } = require('../models/models')
const ApiError = require('../error/ApiError')

class DeviceController {
	async create(req, res, next) {
		try {
			let { name, price, brandId, typeId, info } = req.body
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

			if (info) {
				info = JSON.parse(info)
				info.forEeach((i) => {
					DeviceInfo.create({
						title: i.title,
						description: i.description,
						deviceId: device.id,
					})
				})
			}

			res.status(201).json(device)
		} catch (error) {
			next(ApiError.badRequest(error.message))
		}
	}

	async getAll(req, res) {
		let { brandId, typeId, limit, page } = req.query
		page = page || 1
		limit = limit || 5
		let devices
		const offset = limit * (page - 1)

		if (!brandId && !typeId) {
			devices = await Device.findAndCountAll({ limit, offset })
		}

		if (!brandId && typeId) {
			devices = await Device.findAndCountAll({
				where: { typeId },
				limit,
				offset,
			})
		}

		if (brandId && !typeId) {
			devices = await Device.findAndCountAll({
				where: { brandId },
				limit,
				offset,
			})
		}

		if (brandId && typeId) {
			devices = await Device.findAndCountAll({
				where: { brandId, typeId },
				limit,
				offset,
			})
		}

		res.json(devices)
	}

	async getOne(req, res) {
		const id = req.params.id
		const device = await Device.findOne({
			where: { id },
			include: [{ model: DeviceInfo, as: 'info' }],
		})

		res.json(device)
	}
}

module.exports = new DeviceController()
