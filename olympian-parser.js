var fs = require('fs');

/* Dupe eliminator function from http://stackoverflow.com/a/9229821/2180921 */
function uniq(a) {
    var seen = {};
    return a.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}

fs.readFile('scraped_data.json',function(err, data){
	if (err) throw err; 
	var obj = JSON.parse(data);
	var newArr = [];
	/* Only do the first 100 records for testing */
	for(var n = 0; n < 100; n++){
	/* ^^ Comment out this bitch ^^ */
	/* vv Then uncomment this bitch entire file parsing vv */
	// for (var n = 0; n < obj.length; n++){ 
		var objToPush = {};
		for (var key in obj[n]){
			if (obj[n][key].length = 1){
				/* If key value array of length 1, add to objToPush as string */
				var sItem = obj[n][key][0];
				if (typeof obj[n][key][0] === 'string'){
					objToPush[key] = sItem.trim();
				} else {
					objToPush[key] = sItem;
				}
			}

			/* Do the results! */
			if (key == "results"){
				/* Results is initially an array with a single object in it. Damnit, Scrapy! */
				var oResults = obj[n]["results"][0];
				for (var resultKey in oResults){
					if (oResults[resultKey].length != 1){
						/* If key in "results" obj is greater than len 1, check for and elim dupes */
						objToPush["results"][resultKey] = uniq(oResults[resultKey]).length == 1 ?
							uniq(oResults[resultKey])[0] : uniq(oResults[resultKey]);
					} else {
						/* Key in "results" obj must be one, add the first and only element to the new obj */
						objToPush["results"][resultKey] = oResults[resultKey][0];
					}
				}
			}
		}
		newArr.push(objToPush);
	}
	/* Write new array to file */
	fs.writeFile('parsed_data.json', JSON.stringify(newArr));
});