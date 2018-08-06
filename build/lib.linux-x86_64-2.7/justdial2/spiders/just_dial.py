# -*- coding: utf-8 -*-
import scrapy
import json, ast
import os
import csv
import glob
from justdial2 import items
import time
import datetime


class JustDialSpider(scrapy.Spider):
    name = 'just_dial'
    allowed_domains = ['justdial.com']


    def __init__(self, city='', keyword='',**kwargs):

      kwargs.pop('_job')
      self.base_url = 'https://t.justdial.com/api/india_api_write/01jan2018/searchziva.php?city={}&area=&lat=&long=&darea_flg=0&case=spcall&stype=category_list&search={}&pg_no='.format(city,keyword)
      self.start_urls = [self.base_url + str(x) for x in range(1,50)]
      self.sr_no = 0



    def parse(self, response):
        json_obj = json.loads(response.body_as_unicode())
        sr_no = 0
        #stop = json_obj['results']['data']
        #while stop != 'null' :
        items_list = []
        ts = time.time() 
        timestamp = datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S')


        for i in range(10):
              
              item = items.WebItem()
              item['Name'] = str(json_obj['results']['data'][i][1].encode('utf-8'))
              item['Address'] = str(json_obj['results']['data'][i][3])
              item['Latitude'] = str(json_obj['results']['data'][i][4])
              item['Longitude'] = str(json_obj['results']['data'][i][5])
              item['Contact_No'] = str(json_obj['results']['data'][i][23]['t'] + '  '+json_obj['results']['data'][i][23]['m'] + '  ' + json_obj['results']['data'][i][23]['l']) 
              item['Total_reviews'] = str(json_obj['results']['data'][i][16])
              item['Category'] = str(json_obj['results']['data'][i][14])
              item['Timings'] = str(json_obj['results']['data'][i][11]['timing'])
              #Area = json_obj['results']['data'][i][12]
              if 'business'  in str(json_obj['results']['data'][i][12]):
                item['Area'] = 'N/A'
              elif item['Category'] == str(json_obj['results']['data'][i][12]):
                item['Area'] = 'N/A'
              else:
                item['Area'] = str(json_obj['results']['data'][i][12])
              #number =  json_obj['results']['data'][i][29][0]['val']
              #sumno = (Contact +'  ' +number)
              item['Whatsapp_number'] = str(json_obj['results']['data'][i][34][0])
              item['Rating'] = str(json_obj['results']['data'][i][7])          
              #self.sr_no += 1 
              item['datetime'] = timestamp
              items_list.append(item)
                 
        return items_list


              

   

            


