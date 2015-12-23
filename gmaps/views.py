from django.shortcuts import render
from django.http import HttpResponse
from django.http import HttpResponseRedirect

from django.template.loader import get_template

from django.shortcuts import render

from .forms import GoogleMapsForm

# Create your views here.
def index(request):
    return HttpResponse("<b>Google Maps page!<b>")

def map(request):
    return render(request, 'leaflet-map.html')

def get_location(request):
    # if this is a POST request we need to process the form data
    if request.method == 'POST':
        # create a form instance and populate it with data from the request:
        form = GoogleMapsForm(request.POST)
        # check whether it's valid:
        if form.is_valid():
            # process the data in form.cleaned_data as required
            # ...
            # redirect to a new URL:
            return HttpResponseRedirect('/location/')

    # if a GET (or any other method) we'll create a blank form
    else:
        form = GoogleMapsForm()

    return render(request, 'gmaps-location.html', {'form': form})
