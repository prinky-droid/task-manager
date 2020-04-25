const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs')

const taskSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true
	},
	description: {
		type: String,
		required: true,
		trim: true
	},
	status: {
		type: Boolean,
		default: false
	},
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'Users'
	}
}, {
	timestamps: true
})

/*taskSchema.pre('save', async function (next) {
	const task = this

	if(task.isModified('password')) {
		task.password = await bcrypt.hash(task.password,8)
	}

	console.log('just before saving')
	next()
})*/

const task = mongoose.model('Task', taskSchema)

module.exports = task