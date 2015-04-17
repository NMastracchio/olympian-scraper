from scrapy.contrib.spiders import CrawlSpider, Rule
from scrapy.contrib.linkextractors import LinkExtractor
from scrapy.http import Request
from olympians.items import OlympiansItem

class OlympianCrawler(CrawlSpider):
	name = "olympian"
	allowed_domains = ['www.sports-reference.com']
	start_urls = ['http://www.sports-reference.com/olympics/athletes/']

	def parse(self, response):
		links = response.xpath('//div[@id="initial_list"]/table/tr/td/a/@href').extract()
		for link in links:
			yield Request(url="http://www.sports-reference.com{0}".format(link), callback=self.extract_olympians)
		#yield Request(url="http://www.sports-reference.com{0}".format(links[0]), callback=self.extract_olympians)

		
	def parse_olympian(self, response):
		olympian = OlympiansItem()
		olympian['fullName'] = response.xpath('//div[@id="info_box"]/p/text()[1]').extract()
		olympian['gender'] = response.xpath('//div[@id="info_box"]/p/span[contains(., "Gender:")]/following-sibling::text()[1]').extract()
		olympian['height'] = response.xpath('//div[@id="info_box"]/p/span[contains(., "Height:")]/following-sibling::text()[1]').extract()
		olympian['birthDate'] = response.xpath('//div[@id="info_box"]/p/span[@id="necro-birth"]/@data-birth').extract()
		olympian['deathDate'] = response.xpath('//div[@id="info_box"]/p/span[@id="necro-death"]/@data-death').extract()
		olympian['country'] = response.xpath('//div[@id="info_box"]/p/span[contains(., "Country:")]/following-sibling::a[1]/text()[1]').extract()
		olympian['sport'] = response.xpath('//div[@id="info_box"]/p/span[contains(., "Sport:")]/following-sibling::a[1]/text()[1]').extract()
		return olympian

	def extract_olympians(self, response):
		links = response.xpath('//p[@class="margin_top small_text"]/a/@href').extract()
		for link in links:
			yield Request(url = "http://www.sports-reference.com/{0}".format(link), callback = self.parse_olympian)		