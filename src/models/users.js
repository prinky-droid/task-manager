const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
	name: {
		type: String,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		validate(value) {
			if(!validator.isEmail(value)) {
				throw new Error('Email is invalid')
			}
		}
	},
	password: {
		required: true,
		minlength: 7,
		trim: true,
		type: String,
		validate(val) {
			if(val.includes('password')) {
				throw new Error('Password cannot be password word')
			}
		}
	},
	occupation: {
		type: String,
		default: 'unemployed'
	},
	age: {
		type: Number,
		trim: true,
		validate(value) {
			if(value < 0) {
				throw new Error('Age must be a postive number')
			}
		}
	},
	tokens: [{
		token: {
			type: String,
			required: true
		}
	}],
	upload: {
		type: Buffer
	}
}, {
	timestamps: true
})

userSchema.virtual('tasks', {
	ref: 'Task',
	localField: '_id',
	foreignField: 'owner'
})

userSchema.methods.toJSON = function () {
	const user = this
	const userObject = user.toObject()
	delete userObject.password
	delete userObject.tokens
	delete userObject.upload
	// console.log(userObject)
	return userObject
}

userSchema.methods.geneAuthToken = async function () {
	const user = this
	// console.log(user)
	const token  = jwt.sign({_id: user._id.toString()}, process.env.JWT_TOKEN_KEY, {expiresIn: '3600 seconds'})

	user.tokens = user.tokens.concat({token})
	await user.save()
	return token

}

userSchema.statics.findByCredentials = async (email, password) => {
	const user = await User.findOne({email})
	if(!user) {
		throw new Error('Unable to log in')
	}

	const isMatch = await bcrypt.compare(password, user.password)
	if(!isMatch) {
		throw new Error('Unable to log in')
	}

	return user
}

userSchema.pre('save', async function (next) {
	const user = this

	if(user.isModified('password')) {
		user.password = await bcrypt.hash(user.password,8)
	}

	// console.log('just before saving')
	next()
})

// delete the task if user is remove
userSchema.pre('remove', async function (next) {

	const user = this
	await Task.deleteMany({owner: user._id})
	next()
})

const User = mongoose.model('Users', userSchema)

/*const newUser = new User({
	name: 'hjjh   ',
	email: 'psfdf@gmail.com',
	age: 28,
	password: 'edjkhyg'
})

newUser.save().then(() => {
	console.log(newUser)
}).catch((error) => {
	console.log(error)
})*/

module.exports = (User)