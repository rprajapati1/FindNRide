from django.shortcuts import render
from django.http import HttpResponse
from django.http import HttpResponseRedirect

from django.template.loader import get_template

from django.shortcuts import render

from .forms import YelpForm

from django.http import JsonResponse

import os
import rauth

import json

import django_tables2 as tables

import requests
from rauth import OAuth2Service

import string, random

from .models import Website

def call_uber_api(business_lat, business_long):

    # This access_token is what we'll use to make requests
    access_token = 'wvY41GSscmHLZRvu2VyEQM4QbB3bYIZjW5CwfSPG'

    url = 'https://api.uber.com/v1/estimates/price'
    parameters = {
        'server_token' : '%s' % access_token,
        'start_latitude': '37.8717',
        'start_longitude': '-122.2728',
        'end_latitude': business_lat,
        'end_longitude': business_long,
    }

    response = requests.get(url,params=parameters)
    data = response.json()
    return data['prices'][0]['estimate']

class ResultsTable(tables.Table):
    name = tables.Column()
    address = tables.Column()
    phone = tables.Column()
    url = tables.Column()
    rating = tables.Column()
    distance = tables.Column()
    business_long = tables.Column()
    business_lat = tables.Column()
    uber_estimate = tables.Column()

# Create your views here.
def uber_map(request):
    return render(request, 'uber-map.html')

def index(request):
    return HttpResponse("<b>Yelp Results Page!<b>")

def get_search_parameters(lat,long, keyword='restaurant', radius="2000", results_limit="5"):
    #See the Yelp API for more details
    params = {}
    #params["term"] = "restaurant"
    params["term"] = keyword
    params["ll"] = "{},{}".format(str(lat),str(long))
    params["radius_filter"] = radius
    params["limit"] = results_limit
    return params

def url_shortener():
    s = string.ascii_lowercase + string.ascii_uppercase
    short_url = ''.join(random.sample(s,10))
    return short_url
    # while db.has_key(short_url):
    #     short_url = ''.join(random.sample(s,10))

def call_yelp_api(params):

    # retrieve envronmental variables
    consumer_key = os.environ['YELP_CONSUMER_KEY']
    consumer_secret = os.environ['YELP_CONSUMER_SECRET']
    token = os.environ['YELP_TOKEN']
    token_secret = os.environ['YELP_TOKEN_SECRET']

    # establish session
    # note: need to configure web server with environmental variables
    session = rauth.OAuth1Session(
        consumer_key = consumer_key,
        consumer_secret = consumer_secret,
        access_token = token,
        access_token_secret = token_secret)

    # send request to Yelp API
    request = session.get("http://api.yelp.com/v2/search", params=params)

    #Transforms the JSON API response into a Python dictionary
    data = request.json()
    session.close()

    return data

def get_results(request):

    # if this is a POST request we need to process the form data
    if request.method == 'POST':
        # create a form instance and populate it with data from the request:
        form = YelpForm(request.POST)
        # check whether it's valid:
        if form.is_valid():
            # process the data in form.cleaned_data as required

            if not request.POST.get('num_results', ''):
                num_results = 1
            else:
                num_results = request.POST['num_results']

            if not request.POST.get('lat', ''):
                lat = 37.8717
            else:
                lat = request.POST['lat']

            if not request.POST.get('lng', ''):
                lng = -122.2728
            else:
                lng = request.POST['lng']

            if not request.POST.get('keyword', ''):
                params = get_search_parameters(lat,lng, results_limit=num_results) # initially, user's location is hardcoded to Berkeley
            else:
                # pass-in user's keyword in form, if entered
                params = get_search_parameters(lat,lng, request.POST['keyword'], results_limit=num_results) # initially, user's location is hardcoded to Berkeley
            # if not request.POST.get('keyword', ''):
            #     params = get_search_parameters(37.8717,-122.2728, results_limit=num_results) # initially, user's location is hardcoded to Berkeley
            # else:
            #     # pass-in user's keyword in form, if entered
            #     params = get_search_parameters(37.8717,-122.2728, request.POST['keyword'], results_limit=num_results) # initially, user's location is hardcoded to Berkeley


            # retrieve results
            results = call_yelp_api(params)
            #print(results)

            # extract resultsname'] = yelp_listing['name']
            businesses = results['businesses']
            yelp_result_set = []

            for business in businesses:
                business_result = {}
                business_result['name'] = business['name']
                business_result['address'] = business['location']['address'][0]
                business_result['phone'] = business['phone']
                business_result['url'] = business['url']
                business_result['rating'] = business['rating']
                business_result['distance'] = business['distance']
                business_result['business_long'] = business['location']['coordinate']['longitude']
                business_result['business_lat'] = business['location']['coordinate']['latitude']
                yelp_result_set.append(business_result)

            for row in yelp_result_set:
                lat = float(row['business_lat'])
                longitude = float(row['business_long'])
                row['uber_estimate'] = call_uber_api(lat, longitude)
                row['short_url'] = url_shortener()
                # write to database (row['short_url'],row['url'])
                Website(short_url=row['short_url'], long_url=row['url']).save()

            # render HTML page:
            # return render(request, 'yelp-results.html', {'form': form, 'table':ResultsTable(yelp_result_set) })
            return JsonResponse({'response' : yelp_result_set})

    # if a GET (or any other method) we'll create a blank form
    else:
        form = YelpForm()
        params = get_search_parameters(37.8717,-122.2728) # initially, user's location is hardcoded to Berkeley
        #print(params)
        results = call_yelp_api(params)

    # return render(request, 'yelp-results.html', {'form': form, 'table':ResultsTable({})})
    return JsonResponse({'response' : yelp_result_set})
