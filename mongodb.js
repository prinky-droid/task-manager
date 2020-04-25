// CRUD
/*const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient;
const ObjectId = mongodb.ObjectID*/

const {MongoClient, ObjectId} = require('mongodb')

// Connection URL
const url = 'mongodb://localhost:27017';
const database = 'task-manager';

const id = new ObjectId()
// console.log(id)

MongoClient.connect(url, {useNewUrlParser: true}, (error,client) => {
	if(error) {
		return console.log('Unable to coonect to db')
	}
	// console.log('Connection success')
	const db = client.db(database);

	/*db.collection('users').insertOne({
		name : 'vidya1',
		age : 26
	}, (err, res) => {
		if(err) {
			return console.log('Unable to insert users')
		}
		console.log('User inserted successfully')
		console.log(res)
	})*/

	/*db.collection('users').insertMany([
		{
			name : 'Jen',
			age :36
		},
		{
			name : 'Gunther',
			age : 7
		}
	], (err,res) => {
		if(err) {
			return console.log('Unable to insert users')
		}
		console.log(res)
	})*/

	/*db.collection('users').findOne({name:"Jen"}, (err,res) => {
		if(err) {
			return console.log('unable to fetch');
		}
		console.log(res)
	});

	db.collection('users').find({name:"Priyanka"}).toArray((err,res) => {
		if(err) {
			return console.log('unable to fetch');
		}
		console.log(res)
	})*/

	/*const updatePromise = db.collection('users').updateOne({
		name : 'Apurva'
	}, {
		$inc : {
			age : 5
		}
	})

	updatePromise.then((res) => {
		console.log('success',res)
	}).catch((err) => {
		console.log('Error',err)
	})*/

	db.collection('users').deleteMany({
		name : 'Apurva'
	}).then((res) => {
		console.log('success',res)
	}).catch((err) => {
		console.log('Error',err)
	})


})