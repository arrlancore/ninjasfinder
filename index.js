//  require express
const express=require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');

// set up express app
const app=express();

// use body-parser
app.use(bodyParser.json());

// connect to mongoDB
mongoose.connect('mongodb://localhost:27017/ninjago');
mongoose.Promise=global.Promise;

// static route
app.use(express.static('public'));

// initialize routes
app.use('/api', require('./routes/api'));

// error handling middleware
app.use(function(err,req,res,next){
	// console.log(err);
	res.status(422).send({error:err.message})
});

// listen for request
const port=process.env.port || 4000;
app.listen(port, function(){
	console.log("listening for request via port: "+port);
	});
