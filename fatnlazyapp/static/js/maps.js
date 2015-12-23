var resultsMap;
var currentLat;
var currentLong;
var homeMarker;
var searchResults = [];
var infoWindows = [];
var yelp_results;
var directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});
var directionsService = new google.maps.DirectionsService();

function initialize() {

  var mapCanvas = document.getElementById('map');
  var mapOptions = {
    center: new google.maps.LatLng(37.8717, -122.2728),
    zoom: 16,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  resultsMap = new google.maps.Map(mapCanvas, mapOptions);

  if (navigator.geolocation) {
    var startPos;
    var geoOptions = {
      maximumAge: 5 * 60 * 1000,
      timeout: 10 * 1000
    }

    var geoSuccess = function(position) {
      // If the user location is valid then plot the user's position on the map
      startPos = position;
      lat = startPos.coords.latitude;
      lng = startPos.coords.longitude;
      currentLong = lng;
      currentLat = lat;
      var point = new google.maps.LatLng(lat, lng);
      resultsMap.setCenter(point);
      // var markerImage = 'http://www.mapsmarker.com/wp-content/uploads/leaflet-maps-marker-icons/bar_coktail.png';
      homeMarker = new google.maps.Marker({
        map: resultsMap,
        position: point,
        // icon: markerImage
      });

      // If the user clicks on the Home marker then pop up an information window
      // telling him that this is his current location
      var contentString = '<p class="text-info">Current Location!!!<p>';
      var infowindow = new google.maps.InfoWindow({
        content: contentString
      });

      google.maps.event.addListener(homeMarker, 'click', function() {
        infowindow.open(resultsMap, homeMarker);
      });
    };


    var geoError = function(error) {
      // If the user's location is invalid or we are unable to capture the users
      // location then display the appropriate error message
      console.log('Error occurred. Error code: ' + error.code);
      // error.code can be:
      //   0: unknown error
      //   1: permission denied
      //   2: position unavailable (error response from location provider)
      //   3: timed out
    };


    // Try to get user's current location using his IP address
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
  } else {
    alert('Geolocation is not supported for this Browser/OS version yet.');
  }


  // If the user enters food options, then call the searchFood function
  document.getElementById("searchFood").onclick = searchFood;

  // If the user tries to change his current location then try to guess
  // user's input by giving him various options
  var input = (document.getElementById('newLocation'));
  var autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo('bounds', resultsMap);

  // Call the searchPlace function to change user's location on map
  document.getElementById("changeLocation").onclick = searchPlace;

  // Clear the map if it is already populated
  if(directionsDisplay != null) {
    directionsDisplay.setMap(null);
    directionsDisplay = null;
  }
}

function searchPlace() {
  // Get the location entered by the user
  var geocoder = new google.maps.Geocoder();
  var addressBar = (document.getElementById('newLocation'));
  var address = addressBar.value;

  // Verify if the entered location is valid
  geocoder.geocode({
    'address': address
  }, function(results, status) {

    // If the entered location is valid  
    if (status === google.maps.GeocoderStatus.OK) {

      newLocation = results[0].geometry.location;
      currentLat = newLocation.lat();
      currentLong = newLocation.lng();

      // Reset the home marker to the new specified location
      if (homeMarker != null) {
        homeMarker.setMap(null);
      }
      homeMarker = new google.maps.Marker({
        position: newLocation,
        // map: resultsMap,
        // icon: markerImage
      });

      homeMarker.setMap(resultsMap);

      // Attach an information window to the home marker which on a click 
      // shows that this is user's current location
      var contentString = '<p class="text-info">Current Location!!!<p>';
      var infowindow = new google.maps.InfoWindow({
        content: contentString
      });

      google.maps.event.addListener(homeMarker, 'click', function() {
        infowindow.open(resultsMap, homeMarker);
      });

      // if ((!resultsMap.getBounds().contains(homeMarker.getPosition()))) {
        resultsMap.setCenter(homeMarker.getPosition());
      // }

      // Clear any previous results on the map
      if (searchResults.length > 0) {
        for (index = 0; index < searchResults.length; index++) {
          var tempMarker = searchResults[index];
          if (tempMarker != null) {
            tempMarker.setMap(null);
          }
        }
        searchResults = [];
        infoWindows = [];
        if(directionsDisplay != null) {
            directionsDisplay.setMap(null);
            directionsDisplay = null;
        }
      }

    } else {
      // If the entered location was invalid then display an error message
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });

}

function searchFood() {
  // Get the food query entered by the user
  var cuisine = (document.getElementById('cuisine').value);

  // Call the Yelp and Uber APIs by passing the user
  // query to them
  $.ajax({
    type: "POST",
    url: "/get_results",
    data: {
      lat: currentLat,
      lng: currentLong,
      num_results: 10,
      keyword: cuisine
    }
  }).done(function(param) {
    
    // Clear any previous results on the map
    if (searchResults.length > 0) {
      for (index = 0; index < searchResults.length; index++) {
        var tempMarker = searchResults[index];
        if (tempMarker != null) {
          tempMarker.setMap(null);
        }
      }
      searchResults = [];
      infoWindows = [];

      if(directionsDisplay != null) {
          directionsDisplay.setMap(null);
          directionsDisplay = null;
      }
    }

    // Get the results from Yelp and Uber API 
    yelp_results = param['response']
    directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});

    var len = yelp_results.length;
    var markerImage = 'http://www.mapsmarker.com/wp-content/uploads/leaflet-maps-marker-icons/bar_coktail.png';

    // Do the following for every Yelp-establishment returned
    // by the Yelp API
    for (i = 0; i < len; i++) {
      item = yelp_results[i];
      bus_lat = item['business_lat'];
      bus_long = item['business_long'];
      var point = new google.maps.LatLng(bus_lat, bus_long);

      // Plot the yelp-listed establishments returned by the Yelp API
      // on the map
      var marker = new google.maps.Marker({
        position: point,
        title: item['name'],
        icon: markerImage,
        infoWindowIndex: i
      });

      // If the user clicks on any of the Yelp-establishments 
      // on the map the open an information window giving the 
      // establishment's name, rating, Uber-fare estimate
      // and a shortened URL link to the establishment's Yelp page
      // Also display the shortest driving direction from the user's 
      // current location to the clicked establishment
      var contentString = item['name'];
      var infowindow = new google.maps.InfoWindow({
        content: contentString
      });

      // Code for the information window
      google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
          var tempUrl = "http://find-and-ride.herokuapp.com/" + yelp_results[i]['short_url'];

          infowindow.setContent('<p class="text-info">' +'<b>' + yelp_results[i]['name']+ '</b>' +': An Uber is available at '+'<b>'+ yelp_results[i]['uber_estimate']+'</b>' +' to take you here.<b><br>Rating</b>: '+yelp_results[i]['rating']+'/5 <b><br>Distance</b>: '+String((parseFloat(yelp_results[i]['distance'])/1000).toFixed(3))+' km<br><b>Phone #</b>: '+yelp_results[i]['phone']+' <br>To know more about this place, please visit its yelp page: ' + '<a href="'+ tempUrl +'" target="_blank"><b>'+ yelp_results[i]['short_url']+'</b></a>'+'</p>');
          infowindow.open(resultsMap, marker);

            // Code for the directions to the Yelp-establishment
            directionsDisplay.setMap(resultsMap);

            var start = homeMarker.getPosition();
            var end = marker.getPosition();
            var request = {
                origin:start,
                destination:end,
                travelMode: google.maps.TravelMode.DRIVING
              };
              directionsService.route(request, function(result, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                  directionsDisplay.setOptions({ preserveViewport: true });
                  directionsDisplay.setDirections(result);
                }
            });
        }
      })(marker, i));



      marker.setMap(resultsMap);

      infoWindows.push(infowindow);
      searchResults.push(marker)

    }
    // Adjust the map so that all the Yelp establishments
    // are displayed withing the boundaries of the map
    autoCenter();
  });


}

function autoCenter() {
      //  Create a new viewpoint bound
      var bounds = new google.maps.LatLngBounds();
      //  Go through each...
      for (var i = 0; i < searchResults.length; i++) {
				bounds.extend(searchResults[i].getPosition());
      }
      //  Fit these bounds to the map
      //resultsMap.setCenter(bounds.getCenter());
       resultsMap.fitBounds(bounds);
}

// Boiler plate to display the map on page load
google.maps.event.addDomListener(window, 'load', initialize);
