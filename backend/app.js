//import libraries
let path = require('path');
let express  = require('express');
let bodyParser = require('body-parser');
let resource = require('./routes/resource');

//--------------------------------------------------
// this middleware will be executed for every request to the app
let app = express();


app.use(bodyParser.json());
app.use('/api/v1', resource);
app.use('/', express.static(path.join(__dirname, 'client/build')))

//--------------------------------------------------
//Main
module.exports = app;
