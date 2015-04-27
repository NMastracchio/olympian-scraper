var fs = require('fs');

Array.prototype.max = function() {
  	var iqr = this.q3() - this.q1();
  	return this.q1() + iqr*1.5;
};

Array.prototype.min = function() {
	var iqr = this.q3() - this.q1();
  	return this.q1() - iqr*1.5;
};

Array.prototype.median = function(){
	this.sort( function(a,b) {return a - b;} );
    var half = Math.floor(this.length/2);
    if(this.length % 2)
        return this[half];
    else
        return (this[half-1] + this[half]) / 2.0;
};

Array.prototype.q1 = function(){
	this.sort( function(a,b) {return a - b;} );
	return this[Math.floor((this.length / 4))];
};

Array.prototype.q3 = function(){
	this.sort( function(a,b) {return a - b;} );
	return this[Math.ceil((this.length * (3 / 4)))];
};

/* Dupe eliminator function from http://stackoverflow.com/a/9229821/2180921 */
function uniq(a) {
    var seen = {};
    return a.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}

fs.readFile('./data/summer_2008.json',function(err, data){
	if (err) throw err;
	var obj = JSON.parse(data);
	var oAges = {}; /* { "Weightlifting - Female": [2,19,81,62,23] } */
	var sKey = null;
	for (var n = 0; n < obj.length; n++){
		sKey = obj[n]['results']['2008 Summer']['sport'] + ' - ' + obj[n]['gender'];
		
		/* Initiliaze property to empty array if it does not exist */
		if(!oAges.hasOwnProperty(sKey)){
			oAges[sKey] = [];
		}
		oAges[sKey].push(parseInt(obj[n]['results']['2008 Summer']['age']));
	}
	var aBoxValues = [];
	var aOutlierValues = [];
	var aLabels = [];
	
	
	for (var key in oAges){
		aLabels.push(key);
		aBoxValues.push([oAges[key].min(),oAges[key].q1(),oAges[key].median(),oAges[key].q3(),oAges[key].max()]);
		

		for (var i = 0; i < oAges[key].length; i++){
			if(oAges[key][i] < oAges[key].min() || oAges[key][i] > oAges[key].max()){
				aOutlierValues.push([key, oAges[key][i]]);
			}
		}
	}

	aOutlierValues = uniq(aOutlierValues);
	fs.writeFile('./data/outliers.json', JSON.stringify(aOutlierValues));
	fs.writeFile('./data/ages.json', JSON.stringify(aBoxValues));
	fs.writeFile('./data/labels.json', JSON.stringify(aLabels));
});