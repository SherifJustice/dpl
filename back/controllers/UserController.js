import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import UserModel from '../models/User.js'

export const register = async (req, res) => {
	try {
		const password = req.body.password
		const salt = await bcryptjs.genSalt(10)
		const hash = await bcryptjs.hash(password, salt)

		const doc = new UserModel({
			email: req.body.email,
			passwordHash: hash,
			isAdmin: false,
		})
		const user = await doc.save()
		const token = jwt.sign(
			{
				_id: user._id,
			},
			'privateKey',
			{
				expiresIn: '30d',
			}
		)
		const { passwordHash, ...userData } = user._doc
		res.json({
			...userData,
			token,
		})
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось зарегистрироваться',
		})
	}
}

export const login = async (req, res) => {
	try {
		const user = await UserModel.findOne({ email: req.body.email })
		if (!user) {
			return res.status(400).json({
				message: 'Неверный логин или пароль',
			})
		}
		const token = jwt.sign(
			{
				_id: user._id,
			},
			'privateKey',
			{
				expiresIn: '30d',
			}
		)
		const { passwordHash, ...userData } = user._doc
		res.json({
			...userData,
			token,
		})
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось авторизоваться',
		})
	}
}

export const getMe = async (req, res) => {
	try {
		const user = await UserModel.findById(req.userId)
		if (!user) {
			return res.status(404).json({
				message: 'Пользователь не найден',
			})
		}
		const { passwordHash, ...userData } = user._doc
		res.json(userData)
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось найти пользователя',
		})
	}
}

export const getAdmin = async (req, res) => {
	try {
		const admin = await UserModel.findById(req.userId)
		if (!admin) {
			return res.status(404).json({
				message: 'Пользователь не найден',
			})
		}
		const { passwordHash, ...adminData } = admin._doc
		if (!adminData.isAdmin) {
			return res.status(404).json({
				message: 'Пользователь не найден',
			})
		}
		res.json(adminData)
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось найти пользователя',
		})
	}
}

export const update = async (req, res) => {
	try {
		const userId = req.params.id
		await UserModel.updateOne(
			{
				_id: userId,
			},
			{
				fullName: req.body.fullName,
				email: req.body.email,
				avatarUrl: req.body.avatarUrl,
			}
		)
		res.json({
			success: true,
		})
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось обновить данные',
		})
	}
}
