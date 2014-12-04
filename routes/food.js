var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
	var food = new Array(food_db.length);
	for(var i=0;i<food_db.length;i++){
		food[i] = {value: food_db[i].food_id, label: food_db[i].food_long_desc};
	}
  res.json(food);
});

router.get('/similar/:id', function(req, res) {
	var my_idx = 0;
	for(var i=0;i<8618;i++) {
		if(food_ids[i]==req.params.id){
			my_idx = i;
			break;
		}
	}
	var my_distances = new Array(8618);
	for(var i=0;i<my_distances.length;i++){
		my_distances[i] = {idx:i,dist:maths.getij(distances,i,my_idx)};
	}
	my_distances.sort(function(a,b){return a.dist-b.dist});
	most_similar = [];
	for(var i=0;i<11;i++){
		most_similar.push(food_db[my_distances[i].idx]);
		most_similar[i]["distance"] = my_distances[i].dist;
	}
  res.json(most_similar);
});

module.exports = router;