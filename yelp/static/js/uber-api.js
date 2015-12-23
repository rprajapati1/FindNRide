// Uber API Constants
var uberClientId = "cIjY4nruo3kEPkjcmjVJo3QD-2okP7Gc",
  uberServerToken = "hBWCmZUm0mq1QGER3jHEQnPEVx4l8tws6v_XTpOL";

// // Uber API Constants
// var uberClientId = "YOUR_CLIENT_ID"
// 	, uberServerToken = "YOUR_SERVER_TOKEN";

// Create variables to store latitude and longitude
var userLatitude, userLongitude, partyLatitude = 37.8713, partyLongitude = -122.2585;

navigator.geolocation.watchPosition(function(position) {
  // Update latitude and longitude
  userLatitude = position.coords.latitude;
  userLongitude = position.coords.longitude;

  // Query Uber API if needed
  getEstimatesForUserLocation(userLatitude, userLongitude);
});

function getEstimatesForUserLocation(latitude, longitude) {
  $.ajax({
    url: "https://api.uber.com/v1/estimates/price",
    headers: {
      Authorization: "Token " + uberServerToken
    },
    data: {
      start_latitude: 37.9013,
      start_longitude: -122.2485,
      end_latitude: partyLatitude,
      end_longitude: partyLongitude
    },
    success: function(result) {
      console.log(result);
      $('#current_location').html(latitude + ", " + longitude)
      $('#end_location').html(partyLatitude + ", " + partyLongitude)
      $('#price1').html(result.prices[0].display_name + " " + result.prices[0].estimate);
      $('#price2').html(result.prices[1].display_name + " " + result.prices[1].estimate);
      $('#price3').html(result.prices[2].display_name + " " + result.prices[2].estimate);
      $('#price4').html(result.prices[3].display_name + " " + result.prices[3].estimate);
      $('#price5').html(result.prices[4].display_name + " " + result.prices[4].estimate);
      $('#price6').html(result.prices[5].display_name + " " + result.prices[5].estimate);
    }
  });
}
