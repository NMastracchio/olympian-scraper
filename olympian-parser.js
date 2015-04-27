var fs = require('fs');

/* Dupe eliminator function from http://stackoverflow.com/a/9229821/2180921 */
function uniq(a) {
    var seen = {};
    return a.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}

/* Array shuffler function from http://stackoverflow.com/a/2450976/2180921 */

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

function cleanUp(data){
	var obj = JSON.parse(data);
	var newArr = [];
	var aSummer2008 = [];
	var bPush = false;
	/* Only do the first 100 records for testing */
	//for(var n = 0; n < 100; n++){
	/* ^^ Comment out this bitch ^^ */
	/* vv Then uncomment this bitch entire file parsing vv */
	for (var n = 0; n < obj.length; n++){ 
		var objToPush = {};
		for (var key in obj[n]){
			if (obj[n][key].length = 1 && key != 'sport'){
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
				/* Results is initially an array with a single object in it. */
				var oResults = obj[n]["results"][0];
				for (var resultKey in oResults){
					/*if (oResults[resultKey].length != 1){
						objToPush["results"][resultKey] = uniq(oResults[resultKey]).length == 1 ?
							uniq(oResults[resultKey])[0] : uniq(oResults[resultKey]);
					} else {
						objToPush["results"][resultKey] = oResults[resultKey][0];
					}*/
					for(var l = 0;l < oResults['games'].length;l++){
						objToPush["results"][oResults["games"][l]]={
								"age": oResults['age'][l],
								"sport": oResults['sport'][l]
							};
					}
					if (resultKey == "games"){
						if (oResults["games"].length == 1){
							if (oResults["games"][0] == "2008 Summer"){
								bPush = true;
							}
						} else {
							if (oResults["games"].indexOf("2008 Summer") > -1){
								bPush = true;
							}
						} 
					}
				}
			}
		}
		if (bPush){
			/* If year matches 2008 Summer */
			delete objToPush['results']['age'];
			delete objToPush['results']['sport'];
			delete objToPush['results']['games'];
			aSummer2008.push(objToPush);
			bPush = false;
		}
		newArr.push(objToPush);
	}
	
	/* Shuffle summer results */
	var aShuffled = shuffle(aSummer2008);
	/* Get 1000 objects */
	var aSample = aShuffled.slice(0,1000);
	
	fs.writeFile('./data/parsed_data.json', JSON.stringify(newArr));
	fs.writeFile('./data/summer_2008.json', JSON.stringify(aSummer2008));
	fs.writeFile('./data/summer_2008-sample.json', JSON.stringify(aSample));
	console.log('Wrote ' + newArr.length + ' records to parsed_data.json.');
	console.log('Wrote ' + aSummer2008.length + ' records to summer_2008.json.');
	console.log('Write ' + aSample.length + ' records to summer_2008-sample.json.');
}

fs.readFile('./data/scraped_data.json',function(err, data){
	if (err) throw err; 
	cleanUp(data);
});
