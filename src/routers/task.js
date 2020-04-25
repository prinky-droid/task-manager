const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/task', auth, async (req,res) => {
	const task = new Task({
		...req.body,
		owner: req.user._id
	})

	try {
		await task.save()
		res.status(200).send(task)
	} catch(e) {
		res.status(400).send(e)
	}

	/*task.save().then(() => {
		res.status(201).send(task)
	}).catch((e) => {
		res.status(400).send(e)
	})*/
})

router.get('/task/me', auth, async (req,res) => {
	// const task = await Task.find({owner: req.user._id})
	const match = {}
	const sort = {}

	if(req.query.status) {
		match.status = req.query.status === 'true'
	}

	if(req.query.sortBy) {
		const part = req.query.sortBy.split(':')
		sort[part[0]] = part[1] === 'asc' ? 1 : -1
	}
	
	await req.user.populate({
		path: 'tasks',
		match,
		options: {
			limit: parseInt(req.query.limit),
			skip: parseInt(req.query.skip),
			sort
		}
	}).execPopulate()
	res.send(req.user.tasks)
})

/*router.delete('/task/me', auth, async (req,res) => {
	const match = {}
	if(req.query.name) {
		match.name = req.query.name
	}
	await req.user.populate({
		path: 'tasks',
		match
	}).execPopulate()
	try {
		await Task.deleteMany({req.user.tasks})
		res.status(200).send(req.user.tasks)
	} catch(e) {
		res.status(500).send()
	}
})*/

module.exports = (router)