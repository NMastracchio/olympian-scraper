# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# http://doc.scrapy.org/en/latest/topics/items.html

import scrapy


class OlympiansItem(scrapy.Item):
    fullName = scrapy.Field()
    gender = scrapy.Field()
    height = scrapy.Field()
    birthDate = scrapy.Field()
    deathDate = scrapy.Field()
    country = scrapy.Field()
    sport = scrapy.Field()
    pass
