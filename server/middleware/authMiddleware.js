const jwt = require('jsonwebtoken')
const { User } = require('../models/models')
const ApiError = require('../error/ApiError')

module.exports = function (req, res, next) {
	if (req.method === 'OPTIONS') {
		next()
	}
	try {
		const token = req.headers.authorization.split(' ')[1]
		if (!token) {
			return res.status(401).json({ message: 'Unathorized' })
		}
		const decoded = jwt.verify(token, process.env.SECRET_KEY)
		req.user = decoded
		next()
	} catch (error) {
		res.status(401).json({ message: 'Unathorized' })
	}
}
