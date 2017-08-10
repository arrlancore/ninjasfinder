//  require express
const express=require('express');
// router
const router=express.Router();
// ninja
const Ninja=require('../models/ninja');
// get all list ninjas
router.get('/ninjas/all', function(req,res){
	 Ninja.find({}, function(err, users) {
    var userMap = {};

    users.forEach(function(user) {
      userMap[user._id] = user;
    });

    res.send(userMap);  
  });

});

// Get ninja by GeoLoc
router.get('/ninjas', function(req,res,next){
	Ninja.geoNear({
		type:"Point",
		coordinates:[parseFloat(req.query.lng), parseFloat(req.query.lat)]},
		{maxDistance:1000000, spherical:true}
		).then(function(ninjas){
			res.send(ninjas);
		});
  });


// add a new ninja
router.post('/ninjas', function(req,res,next){
	// get the data on body and send to models
	Ninja.create(req.body).then(function(ninja){res.send(ninja);
	}).catch(next);
});

// update ninjas
router.put('/ninjas/:id', function(req,res, next){
	Ninja.findByIdAndUpdate({_id:req.params.id}, req.body).then(function(ninja){
		Ninja.findOne({_id:req.params.id}).then(function(ninja){
			res.send(ninja)	
		});
	});
	
});

// update power
	// add new power
	router.put('/ninjas/power/:id', function(req,res, next){
	Ninja.findByIdAndUpdate(
     {_id:req.params.id},
     { $push: {"power": req.body}},
     {  safe: true, upsert: true},
       function(err, model) {
         if(err){
        	console.log(err);
        	return res.send(err);
         }
          Ninja.findOne({_id:req.params.id}).then(function(ninja){
			res.send(ninja);	
 		});
      });
	
});
	// update the power
	router.put('/ninjas/power/:id/:powerid', function(req,res, next){
		Ninja.update({'power._id': {_id:req.params.powerid}},
      {'$set': {
             'power.$': req.body,
	   }},
          function(err,model) {
	   	if(err){
        	console.log(err);
        	return res.send(err);
        }
        Ninja.findOne({_id:req.params.id}).then(function(ninja){
			res.send(ninja);	
 		});
 		});
	});
	

// delete ninjas
router.delete('/ninjas/:id', function(req,res,next){
	Ninja.findByIdAndRemove({_id:req.params.id}).then(function(ninja){
		res.send(ninja);
	})
	
});

// remove an object array
router.put('/ninjas/power/:id/:pid', function(req,res, next){
	Ninja.update({"_id":req.params.id}, {"$pull":{'power._id':ObjectId(req.params.pid)}},function(err,data){
		if(err) {res.send(err)};
		res.send(data);
	});

	
});

module.exports=router;