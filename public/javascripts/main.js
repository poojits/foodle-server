$(document).ready(function(){
	$('#q-field').val('');
	$('#search-button').on('click', search);
	$('#search').submit(search);
	$.getJSON( "/food", function( json ) {
  	$('#q-field').autocomplete({
  			source: json,
  			minLength:3,
  			messages: {
        	noResults: '',
        	results: function() {},
        },
        select: function(event, ui) {
        	$('#q-field').val(ui.item.label);
        	$('#q-id').val(ui.item.value);
    			return false;
        }
    });
 	});
 	$("#results").on("click",".food_item", food_info);
});
result_data = [];
function food_info(event){
	event.preventDefault();
	var clicked_food_id = $(this).attr('href').split('#')[1];
	var food_data = JSONfind(clicked_food_id);
	console.log(food_data);
	var fields = ["Energy","Total lipid (fat)","Fatty acids, total saturated","Fatty acids, total polyunsaturated","Fatty acids, total monounsaturated","Fatty acids, total trans-polyenoic","Cholesterol","Sodium, Na","Potassium, K","Iron, Fe","Carbohydrate, by difference","Fiber, total dietary","Sugars, total","Protein","Vitamin A, RAE","Vitamin C, total ascorbic acid","Calcium, Ca"];
	var fieldLabels= ["Calories","Total Fat","Saturated fat","Polyunsaturated fat","Monounsaturated fat","Trans fat","Cholesterol","Sodium","Potassium","Iron","Carbohydrate","Dietary fiber","Sugar","Protein","Vitamin A","Vitamin C","Calcium"];
	var output = '<p class="food-name">'+food_data.food_long_desc+'</p>';
	output+='<table class="food-table"><tr><td><b>Amount Per</b>  100 grams</td></tr>';
	for(var i=0;i<fields.length;i++){
		output += '<tr><td>';
		if(fieldLabels[i].indexOf("fat")>-1){
			output += '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp';
		}
		if(food_data.nutrients.hasOwnProperty(fields[i])){
			output += '<b>'+fieldLabels[i]+'</b> '+food_data.nutrients[fields[i]].value + ' ' + food_data.nutrients[fields[i]].unit+'</td></tr>';
		}
		else{
			output += '<b>'+fieldLabels[i]+'</b> 0 g</td></tr>';
		}
	}
	output+='</table>';
	$('#food-info').html(output);

}
function JSONfind(id){
	for(var i=0;i<result_data.length;i++){
		if(result_data[i].food_id == id){
			console.log('food found in cache');
			return result_data[i];
		}
	}
}
function search(event){
	event.preventDefault();
	$('#results').empty();
	$('#food-info').empty();
	var url = "/food/similar/" + $('#q-id').val();
	$.getJSON(url)
	.done(function( data ) {
		var numResults = data.length;
		$('#query-info').html('<p>'+numResults+' results found</p>');
		output = '';
		for(var i=0;i<numResults;i++){
			output += '<li><a class="food_item" href="#'+data[i].food_id+'">'+data[i].food_long_desc+'</a></li>';
		}
		result_data = data;
		$('#results').html(output);
	});
}