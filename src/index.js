const express = require('express');
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express();
const port = process.env.PORT

/*app.use((req,res,next) => {
	// console.log(req.method, req.path)
	if(req.method === 'GET') {
		res.send('GET request are disabled')
	} else {
		next()
	}
})*/

app.use(express.json())
app.use(taskRouter)
app.use(userRouter)



app.listen(port, () => {
	console.log('Server is up ' + port)
})

const Task = require('./models/task')
const User = require('./models/users')

/*const main = async () => {
	const task = await Task.findById('5ea1a9533a99f22f9228454c')
	await task.populate('owner').execPopulate()
	console.log(task.owner)

	const user = await User.findById('5ea1a52cbf2a122c220fb767')
	await user.populate('tasks').execPopulate()
	console.log(user.tasks)
}

main()*/

/*const pet = {
	name: 'HAT'
}

// pet.toJSON = function () {
	// console.log(this)
	// return this
	// return {}
// }
console.log(pet)
*/

/*const jwt = require('jsonwebtoken')
const myfunc = async () => {
	const token  = jwt.sign({_id: 'abc123'}, process.env.JWT_TOKEN_KEY, {expiresIn: '1 seconds'})
	console.log(token)

	const jwtVerify = jwt.verify(token, process.env.JWT_TOKEN_KEY)
	console.log(jwtVerify)

}

myfunc()*/