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
let moment = require('moment');


//--------------------------------------------------
//business logic

var resourceRouter = express.Router();

function mongoWaterfall(req, res, callbacks, done) {
	MongoClient.connect(process.env.MONGO_URI, (err, database) => {
		if (err) throw err;

		var db = database.db(DB_NAME);

		async.waterfall([(cb)=>{cb(null, {req:req, res:res, db:db})}].concat(callbacks), (err, result)=> {
			if (err) {
				console.log(err);
			}
			done(err, result);
			if (database) database.close();
		});

	});
};


function sortAndLimitList(state ,list, callback) {
	const query = state.req.query;

	if (query._sort) {
		list = list.sort((a, b)=> {
			var order = (query._order == 'DESC') ? -1 : 1;

			if (!(query._sort in a)) return -order;
			if (!(query._sort in b)) return order;

			if (a[query._sort] < b[query._sort]) return -order;
			else if (a[query._sort] > b[query._sort]) return order;
			return 0;
		});
	}

	if (query._start && query._start!='NaN') {
		var start = parseInt(query._start);
		var end = parseInt(query._end);
		if ( end < 0 ) {
			list = list.slice(start);
		} else {
			list = list.slice(start, end);
		}
	}

	callback(null, list);
}


function prepareQuery(state, callback) {
	const req = state.req;
	const db = state.db;

	if (req.query.q) {
		return callback(null, state, { name: new RegExp(req.query.q) });
	}

	if (req.query.supplier) {
		return db.collection('suppliers').find({'name': new RegExp(req.query.supplier)}, {id:1}).toArray( (err, suppliers)=> {
			var ids = suppliers.map((s)=> { return s.id});
			callback(err, state, {'supplier_id': {$in: ids} });
		});
	}

	var filter = req.query.filter

	if(filter && filter.indexOf('ids') > -1) {
		filter = filter.replace('ids', '"ids"');
		filter = JSON.parse(filter);
		if (filter['ids'] instanceof Array) {
			//GET_MANY
			filter['id'] = {'$in': filter['ids']};
			delete filter['ids'];
		}
		return callback(null, state, filter);
	}

	var query = Object.keys(req.query).reduce((filtered, key) =>{
		const val = req.query[key];
		if (['_start', '_end', '_sort', '_order', 'id_like'].indexOf(key) < 0) {

			if (['name', 'remarks', 'item'].indexOf(key) != -1) {
				//regex on special key
				filtered[key] = new RegExp(val);
			}
			else if (key == 'date') {
				//handle date
				var md = moment(val, "YYYY-MM-DD")
				var date = md.toDate();
				var nxDate = md.add(1,'days').toDate();
				filtered[key] = {$gt: date, $lt: nxDate};
			}
			else {
				//handle numberical values
				var num = parseInt(val);
				filtered[key] = (num || num==0) ? num : val;
			}
		}
		return filtered;
	}, {});

	callback(null, state, query);
}


function getTotalCountAndList(state, query, callback) {
	const req = state.req;
	const res = state.res;
	const db = state.db;

	var dbq = db.collection(req.params.resource).find(query)
	dbq.count( (err, count) => {
		res.header('X-Total-Count', count);
		if (err) return callback(err);

		dbq.toArray((err, list)=> {
			callback(err, state, list);
		});
	});
}


function findLatestId(state, callback) {
	const db = state.db;
	const req = state.req

	var collection = db.collection(req.params.resource);
	collection.find().sort({id:-1}).limit(1).toArray((err, result)=> {
		id = 0;
		if(result[0]) id = result[0].id;
		callback(err, collection, id + 1);
	});
}

function outputJsonResult(res,statusCode) {
	return (err, json) => {
		if (err) throw err;
		res.status(statusCode).json(json);
	}
}

function expandSuppliers(state, list, callback) {
		const db = state.db;

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
			},

			(list, cb) => {	//last order
				db.collection('orders').aggregate([
					{$group: { _id: "$supplier_id", lastOrdered: { $max: "$date" } }},
				]).toArray(cb);
			},

			(data, cb) => {
				var m = data.reduce((map, obj) => {
					map[obj._id] = obj.lastOrdered;
					return map;
				}, {});

				cb(null, m);
			},

			(lastOrders, cb) => {
				list.forEach((item)=> {
					var id = item['id'];
					if (id in lastOrders) item['lastOrdered'] = lastOrders[id];
				});
				cb(null, list);
			},

			(list, cb) => {	//last clearance
				db.collection('clearances').aggregate([
					{$group: { _id: "$supplier_id", lastPaid: { $max: "$date" } }},
				]).toArray(cb);
			},

			(data, cb) => {
				var m = data.reduce((map, obj) => {
					map[obj._id] = obj.lastPaid;
					return map;
				}, {});

				cb(null, m);
			},

			(lastPaid, cb) => {
				list.forEach((item)=> {
					var id = item['id'];
					if (id in lastPaid) item['lastPaid'] = lastPaid[id];
				});
				cb(null, list);
			},

		], (err, result)=> {
			callback(err, state, result);
		});
	}

//--------------------------------------------------
//Restful API by express

//GET_LIST

resourceRouter.get('/owe', function(req, res) {
	res.header('X-Total-Count', 1);

	const totalOwe = (state, cb) => {
		const db = state.db;

		async.parallel([
			(finish) => {
				db.collection('orders').aggregate([ {$group: { _id:null, cost: { $sum: "$totalCost" } }}, ]).toArray(finish);
			},
			(finish) => {
				db.collection('clearances').aggregate([ {$group: { _id:null, cost: { $sum: "$paid" } }}, ]).toArray(finish);
			},
		], (errs, results) => {
			if (errs) return cb(errs);
			cb(errs, results[0][0].cost - results[1][0].cost);
		});

	};

	mongoWaterfall(req, res, [totalOwe], outputJsonResult(res, 200));
});

resourceRouter.get('/orders', function(req, res) {
	req.params.resource = 'orders';

	const expandOrders = (state, list, callback) => {
		const db = state.db;

		async.forEach(list, (item, next)=>{
			item['unitCost'] = item['totalCost'] / ( item['quantity'] * item['size'] * item['netWeight'] );
			next();
		}, (err)=> {
			callback(err, state, list);
		});
	};

	mongoWaterfall(req, res,
		[prepareQuery, getTotalCountAndList, expandOrders, sortAndLimitList],
		outputJsonResult(res, 200)
	);
});

resourceRouter.get('/suppliers', function(req, res) {
	req.params.resource = 'suppliers';

	mongoWaterfall(req, res,
		[prepareQuery, getTotalCountAndList, expandSuppliers, sortAndLimitList],
		outputJsonResult(res, 200)
	);
});

resourceRouter.get('/:resource', function(req, res) {
	mongoWaterfall(req, res,
		[prepareQuery, getTotalCountAndList, sortAndLimitList],
		outputJsonResult(res, 200)
	);
});

//GET_ONE
resourceRouter.get('/suppliers/:id', function(req, res) {
	req.params.resource = 'suppliers';

	const getSupplier = (state, callback) => {
		const db = state.db;
		const req = state.req;

		var id = parseInt(req.params.id);
		db.collection('suppliers').findOne({'id': id}, (err, res)=>{
			callback(err, state, [res]);
		});
	};

	const extractSupplier = (state, list, callback) => {
		callback(null, list[0]);
	};

	mongoWaterfall(req, res, [getSupplier, expandSuppliers, extractSupplier], outputJsonResult(res, 200) );
});

resourceRouter.get('/:resource/:id', function(req, res) {
	const getOne = (state, callback) => {
		const db = state.db;
		const req = state.req;

		var id = parseInt(req.params.id);
		db.collection(req.params.resource).findOne({'id': id}, callback);
	};

	mongoWaterfall(req, res, [getOne], outputJsonResult(res, 200) );
});



//CREATE
resourceRouter.post('/orders', function(req, res) {
	req.params.resource = 'orders';

	const insertPaidClearance = (supplier_id, paid, lastItem, callback) => {
		const insertClearance = (collection, id, next) => {
			collection.insertOne({'id': id, 'supplier_id': supplier_id, 'date':new Date(), 'paid': paid}, next);
		};

		mongoWaterfall( {params: {resource: 'clearances'}}, {},
			[findLatestId, insertClearance],
			(err, result)=> {
				callback(err, lastItem);
			}
		);

	};

	const insertItems = (collection, id, callback) => {
		//special handle to multiple items creation
		if (!req.body.items) {
			return res.status(406).end();
		}
		var items = JSON.parse(JSON.stringify(req.body.items));
		delete req.body.items;

		var lastItem = null;
		async.forEach(items, (item, next)=> {
			Object.assign(item, req.body);
			item.id = id++;
			item.unit_id = parseInt(item.unit_id);
			item.date = new Date(item.date);

			lastItem = item;
			collection.insertOne(item, next);
		}, (err)=> {
			if (err) return callback(err);

			if (!req.body.isPaid) {
				return callback(err, lastItem);
			}

			var paid = items.reduce((p, i)=>(p+i.totalCost) , 0)
			insertPaidClearance(req.body.supplier_id, paid, lastItem, callback);
		});
	};


	mongoWaterfall( req, res,
		[findLatestId, insertItems],
		outputJsonResult(res, 201)
	);
});


resourceRouter.post('/:resource', function(req, res) {

	const insertOne = (collection, id, callback) => {
		if (!req.body.items || req.body.items==[]) {
			req.body.id = id;
			if (req.body.date) {
				req.body.date = new Date(req.body.date);
			}
			collection.insertOne(req.body, callback);
		}
	};

	mongoWaterfall( req, res,
		[findLatestId, insertOne],
		outputJsonResult(res, 201)
	);
});



//UPDATE
resourceRouter.put('/:resource/:id', function(req, res) {
	mongoWaterfall(req, res, [
		(state, callback) => {
			const db = state.db;
			var collection = db.collection(req.params.resource);
			var id = parseInt(req.params.id);
			delete req.body._id;
			if (req.body.date) {
				req.body.date = new Date(req.body.date);
			}
			collection.updateOne({id: id}, {$set: req.body}, callback);
		},
	], outputJsonResult(res, 201));
});


//DELETE
resourceRouter.delete('/:resource/:id', function(req, res) {
	mongoWaterfall(req, res, [
		(state, callback) => {
			const db = state.db;
			var collection = db.collection(req.params.resource);
			var id = parseInt(req.params.id);
			collection.deleteOne({id: id}, callback);
		},
	], outputJsonResult(res, 204) );
});


//DELETE_MANY
resourceRouter.delete('/:resource', function(req, res) {
	if (!req.query.ids) {
		return res.status(405).end();
	}

	mongoWaterfall(req, res, [
		(state, callback) => {
			const db = state.db;
			var collection = db.collection(req.params.resource);
			collection.deleteMany({id: {'$in': req.query.ids}}, callback);
		},
	], (err, r)=> {
		if (err) throw err;
		res.status(204).json(req.query.ids);
	});
});


//--------------------------------------------------
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
