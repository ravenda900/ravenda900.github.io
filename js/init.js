// TODO
// 1. Add new custom type
// 2. Set center on drag
var types = [
  'pizza',
  'burger',
  'pasta',
  'chicken',
  'barbecue',
  'seafood',
  'soup',
  'noodles',
  'lechon',
  'salad'
];
var map;
var infowindow;
var service;
var directionsDisplay;
var directionsService;
var markers = [];
var circle;
var cebu = {lat: 10.31672, lng: 123.89071};
var loc = cebu;
var population = 922611; //922,611
var radius = Math.sqrt(population) * 100;
var marker_counter = 0;
var markerCluster;
var init = false;

function initMap() {
  directionsDisplay = new google.maps.DirectionsRenderer();
  directionsService = new google.maps.DirectionsService();

  map = new google.maps.Map(document.getElementById('map'), {
    center: cebu,
    zoom: 9
  });
  directionsDisplay.setMap(map);
  directionsDisplay.setPanel(document.getElementById('directions-list'));

  infowindow = new google.maps.InfoWindow();
  service = new google.maps.places.PlacesService(map);

  google.maps.event.addListener(map, 'click', function() {
    infowindow.close();
  });

  scanRestaurants(service, cebu, radius);
  markerCluster = new MarkerClusterer(map, markers, {
    imagePath: './images/m'
  });

  circle = new google.maps.Circle({
    strokeColor: '#0000FF',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#0000FF',
    fillOpacity: 0.3,
    map: map,
    center: cebu,
    radius: radius
  });

  google.maps.event.addListener(circle, 'radius_changed', function() {
    var location = {
      lat: circle.getCenter().lat(),
      lng: circle.getCenter().lng()
    };

    radius = circle.getRadius();

    deleteMarkers();
    scanRestaurants(service, location, radius);

    console.log('Radius has been changed to: ' + circle.getRadius());
  });

  google.maps.event.addListener(circle, 'dragend', function() {
    var location = {
      lat: circle.getCenter().lat(),
      lng: circle.getCenter().lng()
    };

    loc = location;

    deleteMarkers();
    scanRestaurants(service, location, circle.getRadius());

    console.log('Center has been changed to: ', location);
  });
}

function listFormat(review) {
  return '<li class="mdl-list__item mdl-list__item--three-line"> \
    <span class="mdl-list__item-primary-content"> \
      <img src="' + review.profile_photo_url + '" alt="' + review.author_name + '" /> \
      <h5>' + review.author_name + ' \
        <a class="mdl-list__item-secondary-action" href="#" title="' + review.rating.toFixed(1) + '"><i class="material-icons">star</i></a> \
      </h5> \
      <p class="mdl-list__item-text-body" title="' + review.relative_time_description + '"> \
        ' + review.text + ' \
      </span> \
    </span> \
  </li>';
}

function getReviews(place) {
  service.getDetails({
    placeId: place.place_id
  }, function(pl, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      $(() => {
        var $reviews = $('[href="#reviews"]');
        var $list = $('#reviews').find('.mdl-list');

        $('#reviews').find('.review-counter').text(pl.reviews.length);
        $list.empty();

        for (let i = 0 ; i < pl.reviews.length ; i++) {
          $list.append(listFormat(pl.reviews[i]));
        }

        if ($reviews.parent().hasClass('hide')) {
          $reviews.parent().removeClass('hide');
          $reviews.click();
        }
      });

    }
  });
}

function addMarker(place) {
  var marker = new google.maps.Marker({
    position: place.geometry.location,
    map: map
  });

  marker.visit_count = 0;

  google.maps.event.addListener(marker, 'click', function() {
    marker.visit_count++;
    getReviews(place);

    infowindow.setContent('<div> \
      <strong>' + place.name + '</strong><br> \
      ' + place.formatted_address + '<br> \
      <strong>Rating: </strong>' + parseFloat(place.rating).toFixed(1) + '<br> \
      Visited: ' + marker.visit_count + ' times<br> \
      <button data-lat="' + place.geometry.location.lat() + '" data-lng="' + place.geometry.location.lng() + '" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored btn-route">Get Directions</button> \
    </div');
    infowindow.open(map, this);

    $('#directions-list').empty();
    $('[href="#directions"]').parent().addClass('hide');
    $sidebar.open('directions', $('[href="#directions"]').parent());

    $('.btn-route').on('click', function(e) {
      e.preventDefault();

      var $directions = $('[href="#directions"]');

      var lat = $(this).data('lat');
      var lng = $(this).data('lng');

      getDirections(lat, lng);

      if ($directions.parent().hasClass('hide')) {
        $directions.parent().removeClass('hide');
        $directions.click();
      }
    });
  });

  markers.push(marker);
  marker_counter++;
  $('.marker-counter').find('span').text(marker_counter);
}

function getDirections(lat, lng) {
  // Directions
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var request = {
        origin: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
        destination: new google.maps.LatLng(lat, lng),
        travelMode: 'DRIVING'
      };
      directionsService.route(request, function(result, status) {
        if (status == 'OK') {
          directionsDisplay.setDirections(result);
        }
      });
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

function clearMarkers() {
  setMapOnAll(null);
}

function deleteMarkers() {
  clearMarkers();
  markers = [];
  marker_counter = 0;
}

function showMarkers() {
  setMapOnAll(map);
}

function filterMarkers() {
  types = [];
  types = $('input[name="type[]"]').map(function() {
    if ($(this).is(':checked')) {
      return $(this).val();
    }
  }).get();

  deleteMarkers();
  scanRestaurants(service, loc, radius);
}

function scanRestaurants(service, location, radius) {
  if ( ! init) {
    init = true;
    placeSearch({
      location: location,
      radius: radius,
      query: types[0]
    });
  } else {
    for (let i = 0 ; i < types.length ; i++) {
      placeSearch({
        location: location,
        radius: radius,
        query: types[i]
      });
    }
  }
  clearMarkers();
}

function placeSearch(request) {
  request.type = ['restaurant'];

  service.textSearch(request, callback);
}

function callback(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (let i = 0 ; i < results.length ; i++) {
      addMarker(results[i]);
    }
  }
}