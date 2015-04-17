import json

with open('scraped_data.json') as data_file:
	data = json.load(data_file)
count = 0

for olympian in data:
	print(olympian['results'][0]['games'].index('2004 Summer'))

	#for i,j in enumerate(olympian['results'][0]['games']):
	#	if j == "2004 Summer":
	#		count = count + 1
	#		print count
