# import sys
# import MySQLdb
# import hashlib
# from scrapy.exceptions import DropItem
# from scrapy.http import Request


# class Justdial2Pipeline(object):
# 	def __init__(self):
# 		self.conn = MySQLdb.connect(host='localhost',user='root',passwd='',db='sample_db')
# 		self.cursor = self.conn.cursor()



#     def process_item(self, item, spider):
#     	try:
#     		self.cursor.execute("""INSERT  INTO items(Name, Contact_No, WhatsApp_No, Address, Latitude, Longitude, Area, Category, Total_reviews, Rating, Timings) VALUES(%s , %s, %s, %s, %s,%s , %s, %s, %s, %s, %s)""",
#     			                (item['Name'].encode('utf-8'),item['Contact_No'].encode('utf-8'),item['WhatsApp_No'].encode('utf-8'),item['Address'].encode('utf-8'),item['Latitude'].encode('utf-8'),item['Longitude'].encode('utf-8'),item['Area'].encode('utf-8'),item['Category'].encode('utf-8'),item['Total_reviews'].encode('utf-8'),item['Rating'].encode('utf-8'),item['Timings'].encode('utf-8')))
#     		self.conn.commit()

#     	except MySQLdb.Error, e:
#     		print "Error %d: %s" % (e.args[0], e.args[1])

#         return item
