//constants
require('dotenv').config()
const DB_NAME = 'yuencheong';
const PORT = process.env.SERVER_PORT;

//--------------------------------------------------
//import libraries

let async = require('async');
let express = require('express');
let bodyParser = require('body-parser');
let app = express();
let MongoClient = require('mongodb').MongoClient;


//--------------------------------------------------
//business logic

var resourceRouter = express.Router();
var mongoConnect = function(callback) { MongoClient.connect(process.env.MONGO_URI, callback) };


function sortAndLimitList(list, query) {
	return list.sort((a, b)=> {
		var order = (query._order == 'DESC') ? -1 : 1;
		if (a[query._sort] < b[query._sort])
			return -order;
		else if (a[query._sort] > b[query._sort])
			return order;
		return 0;
	})
	.slice(parseInt(query._start), parseInt(query._end));
}

function addDynamicField(db, resource, list, query, callback) {
	switch(resource) {
		case "orders":
			async.forEach(list, (item, next)=>{
				item['unitCost'] = item['totalCost'] / ( item['quantity'] * item['size'] * item['netWeight'] );
				next();
			}, (err)=> {
				callback(err, sortAndLimitList(list, query));
			});
			return;

		case "suppliers":
			async.waterfall([
				(cb)=> {
					db.collection('orders').aggregate([
						{$group: { _id: "$supplier_id", owe: { $sum: "$totalCost" } }},
					]).toArray(cb);
				},

				(data, cb) => {
					var m = data.reduce((map, obj) => {
						map[obj._id] = obj.owe;
						return map;
					}, {});

					cb(null, m);
				},

				(map, cb) => {
					db.collection('clearances').aggregate([
						{$group: { _id: "$supplier_id", paid: { $sum: "$paid" } }},
					]).toArray((err, data)=> {
						data.forEach((item)=> {
							var id = item['_id'];
							if (!(id in map)) {
								map[id] = 0;
							}
							map[id] -=item['paid'];
						});

						cb(err, map);
					})
				},

				(owe, cb) => {
					list.forEach((item)=>{
							item['owe'] = (item['id'] in owe) ? owe[item['id']] : 0;
					});
					cb(null, list);
				}

			], (err, result) => {
				callback(err, sortAndLimitList(result, query));
			});
			return;
	}

	return callback(null, sortAndLimitList(list, query));

}

//--------------------------------------------------
//Restful API by express

//GET_LIST
resourceRouter.get('/:resource', function(req, res) {
	async.waterfall([
		mongoConnect,

		(database, callback) => {
			var db = database.db(DB_NAME);

			var query = req.query.filter
			if (req.query.q) {
				query = { name: new RegExp(req.query.q) };
			} else if(query && query.indexOf('ids') > -1){
					query = query.replace('ids', '"ids"');
					query = JSON.parse(query);
					if (query['ids'] instanceof Array) {
					//GET_MANY
					query['id'] = {'$in': query['ids']};
					delete query['ids'];
				}
			}

			var dbq = db.collection(req.params.resource).find(query)
			dbq.count( (err, count) => {
				res.header('X-Total-Count', count);
				if (err) return callback(err);

				/*
				var q = req.query;
				var sort = {}; sort[q._sort] = (q._order=='DESC'?-1:1);
				var skip = parseInt(q._start);
				var limit = parseInt(q._end) - skip;
				*/

				//dbq.sort(sort).skip(skip).limit(limit).toArray((err, list)=> {
				dbq.toArray((err, list)=> {
					callback(err, db, list);
				});
			});
		},

		(db, list, callback) => {
			addDynamicField(db, req.params.resource, list, req.query, callback);
		},
	], (err, result) => {
		if (err) throw err;
		res.json(result);
	});

});


//GET_ONE
resourceRouter.get('/:resource/:id', function(req, res) {
	_db = null;
	async.waterfall([
		mongoConnect,

		(database, callback) => {
			_db = database;
			var db = database.db(DB_NAME);
			var id = parseInt(req.params.id);
			db.collection(req.params.resource).findOne({'id': id}, callback);
		}
	], (err, r) => {
		if (err) throw err;
		res.json(r);
		if (_db) _db.close();
	});
});




//CREATE
resourceRouter.post('/:resource', function(req, res) {
	_db = null;

	async.waterfall([
		mongoConnect,

		(database, callback) => {
			_db = database;
			var db = database.db(DB_NAME);
			var collection = db.collection(req.params.resource);
			collection.find().sort({id:-1}).limit(1).toArray((err, result)=> {
				id = 0;
				if(result[0]) id = result[0].id;
				callback(err, collection, id + 1);
			});
		},

		(collection, id, callback) => {
			req.body.id = id;
			collection.insertOne(req.body, callback);
		},
	], (err, r) => {
		if (err) throw err;

		res.status(201).json(r);
		if (_db) _db.close();
	});
});


//UPDATE
resourceRouter.put('/:resource/:id', function(req, res) {
	_db = null;

	async.waterfall([
		mongoConnect,

		(database, callback) => {
			_db = database;
			var db = database.db(DB_NAME);
			var collection = db.collection(req.params.resource);
			collection.update({id: req.params.id}, {'$set': req.body}, callback);
		},
	], (err, r) => {
		if (err) throw err;

		res.status(201).json(r);
		if (_db) _db.close();
	});
});

//DELETE
resourceRouter.delete('/:resource/:id', function(req, res) {
	_db = null;

	async.waterfall([
		mongoConnect,

		(database, callback) => {
			_db = database;
			var db = database.db(DB_NAME);
			var collection = db.collection(req.params.resource);
			var id = parseInt(req.params.id);
			collection.deleteOne({id: id}, callback);
		},
	], (err, r)=> {
		if (err) throw err;
		res.status(204).json(r);
		if (_db) _db.close();
	});
});


//DELETE_MANY
resourceRouter.delete('/:resource', function(req, res) {
	if (!req.query.ids) {
		return res.status(405).end();
	}

	_db = null;

	async.waterfall([
		mongoConnect,

		(database, callback) => {
			_db = database;
			var db = database.db(DB_NAME);
			var collection = db.collection(req.params.resource);
			collection.deleteMany({id: {'$in': req.query.ids}}, callback);
		},
	], (err, r)=> {
		if (err) throw err;
		res.status(204).json(req.query.ids);
		if (_db) _db.close();
	});
});


// this middleware will be executed for every request to the app
app.use(function (req, res, next) {
	res.header("Content-Type",'application/json');
	res.header('Access-Control-Expose-Headers', 'X-Total-Count');
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.header("Access-Control-Expose-Headers", "X-Total-Count, Content-Range");
	res.header("Access-Control-Allow-Methods", "POST,DELETE,GET,PUT");

	next();
});


app.use(bodyParser.json());
app.use('/api/v1', resourceRouter);


//--------------------------------------------------
//Main
app.listen(PORT);
console.log("Listening on port " + PORT);
