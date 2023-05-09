import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import path from 'path'
import routes from './routes/index.js'

mongoose
	.connect(
		'mongodb+srv://nikolas:q9e7t5kol9mad@cluster0.yd7u5br.mongodb.net/game-shop?retryWrites=true&w=majority'
	)
	.then(() => console.log('Andrew OK'))
	.catch((err) => console.log('Db err', err))
const app = express()

app.use(express.json())
app.use(cors())
app.use(routes)

app.listen(process.env.PORT || 4000, (err) => {
	if (err) {
		return console.log(err)
	}
	console.log('Server ok. Andrew is back!')
})

if (process.env.NODE_ENV === 'production') {
	app.use('/', express.static(path.join(__dirname, 'front')))

	const indexPath = path.join(__dirname, 'front', 'index.html')

	app.get('*', (req, res) => {
		res.sendFile(indexPath)
	})
}
