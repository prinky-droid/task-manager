const express = require('express')
const User = require('../models/users')
const auth = require('../middleware/auth')
const router = new express.Router()
const {sendWelcomeEmail} = require('../emails/account')
const multer = require('multer')
const sharp = require('sharp')
const upload = multer({
	// dest: 'images',
	limits: {
		fileSize: 1000000
	},
	fileFilter(req,file,cb) {
		// if(!file.originalname.endsWith('.pdf')) {
		if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
			return cb(new Error('File must be a pdf'))
		}
		cb(undefined, true)
		// cb(undefined, false)
	}
})

router.get('/test', (req,res) => {
	res.send('hjhjggh')
})

router.post('/users', async (req,res) => {
	const user = new User(req.body);
	
	try {
		await user.save()
		sendWelcomeEmail(user.email, user.name)
		const token  = await user.geneAuthToken()
		// await user.save()
		res.status(200).send({user,token})
	} catch(e) {
		res.status(400).send(e)
	}


	/*user.save().then(() => {
		res.status(201).send(user)
	}).catch((error) => {
		// res.status(400)
		// res.send(error)
		res.status(400).send(error)
	})*/
	// console.log(req.body);
})

router.post('/users/login', async (req,res) => {
	try {
		const user = await User.findByCredentials(req.body.email,req.body.password)
		const token  = await user.geneAuthToken()
		res.send({user, token})
	} catch(e) {
		res.status(404).send('User not found')
	}
})

router.post('/users/logout',auth, async (req,res) => {
	try {
		req.user.tokens = req.user.tokens.filter((token) => {
			return token.token !== req.token
		})
		await req.user.save()
		res.send('User logout successfully')
	} catch(e) {
		res.status(404).send('User not found')
	}
})

router.post('/users/logout_all', auth, async (req,res) => {
	try {
		req.user.tokens = []
		await req.user.save()
		res.send('User logout in all session successfully')

	} catch(e) {
		res.status(404).send('User not found')
	}
})

router.get('/users/me', auth, async (req,res) => {
	res.send(req.user)

	/*try {
		const usersData = await User.find({})
		res.status(200).send(usersData)
	} catch(e) {
		res.status(500).send()
	}*/

	/*User.find({}).then((usersData) => {
		res.status(200).send(usersData)
	}).catch((e) => {
		res.status(500).send()
	})*/
})

router.get('/users/:id', async (req,res) => {

	try {
		const usersData = await User.findById(req.params.id)
		if(!usersData) {
			return res.status(404).send('Users not Found')
		}
		res.status(200).send(usersData)
	} catch (e) {
		res.status(500).send()
	}

	/*User.findById(req.params.id).then((usersData) => {
		if(!usersData) {
			return res.status(404).send('Users not Found')
		}
		res.status(200).send(usersData)
	}).catch((e) => {
		res.status(500).send()
	})*/
})

router.patch('/users/me', auth, async (req,res) => {

	const updates = Object.keys(req.body)
	// console.log(req.body)
	const allowedUpdates = ['name','email','password']
	const isValidOperation = updates.every((update) => {
		return allowedUpdates.includes(update)
	})

	if(!isValidOperation) {
		return res.status(400).send({error: 'Invalid updates'})
	}

	try {

		// const user = await User.findById(req.user._id)

		updates.forEach((update) => {
			req.user[update] = req.body[update]
		})

		await req.user.save()

		res.status(200).send(req.user)
	} catch(e) {
		res.status(400).send(e)
	}
})

router.delete('/users/me', auth, async (req, res) => {

	try {
		/*const user = await User.findByIdAndDelete(req.params.id)
		if(!user) {
			return res.status(404).send('User not found')
		}*/

		await req.user.remove()
		res.status(200).send(req.user)
	} catch(e) {
		res.status(500).send()
	}
})

router.post('/users/me/avatar', auth, upload.single('upload'), async(req, res) => {
	const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
	req.user.upload = buffer
	await req.user.save()
	res.send('upload success');
}, (e,req,res,next) => {
	res.status(400).send(e.message);
	res.status(400).send(e.message);
})

router.get('/users/:id/image', async (req,res) => {

	const user = await User.findById(req.params.id)
	// return res.send(user)
	try {
		if(!user || !user.upload) {
			throw new Error()
		}
		res.set('Content-Type','image/png')
		res.send(user.upload)

	} catch(e) {
		res.status(400).send('no image');
	}
})

module.exports = router