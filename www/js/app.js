// Ionic Starter App

var FIREBASE_GEO_REF = 'https://maparoundme.firebaseio.com/geo/';

var GEO_ID_PREFIX = 'geo-';

var FIREBASE_FACT_REF = 'https://maparoundme.firebaseio.com/facts/';

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova', 'firebase', 'ionic-material'])

.config(function($stateProvider, $urlRouterProvider) {
 
  $stateProvider
    .state('map', {
      url: '/map',
      templateUrl: 'templates/map.html',
      controller: 'MapCtrl'
    })
    .state('firstLoad', {
      url: '/firstLoad',
      templateUrl: 'templates/firstLoad.html',
      controller: 'FirstLoadCtrl'
    })
    .state('create', {
      url: '/create',
      templateUrl: 'templates/create.html',
      controller: 'CreateCtrl'
    })
    .state('selectMap', {
      url: '/selectMap',
      templateUrl: 'templates/mapselect.html',
      controller: 'MapSelectCtrl'
    })
    .state('useAddress', {
      url: '/useAddress',
      templateUrl: 'templates/useAddress.html',
      controller: 'UseAddressCtrl'
    })
    .state('viewFact', {
      url: '/viewFact',
      templateUrl: 'templates/viewfact.html',
      controller: 'ViewFactCtrl'
    })
    .state('initial', {
      url: '/',
      templateUrl: 'templates/loading.html',
      controller: 'InitialCtrl'
    });
 
  $urlRouterProvider.otherwise('/');
 
})

.directive('googleplace', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, model) {
            var options = {
                types: [],
                componentRestrictions: {}
            };
            scope.gPlace = new google.maps.places.Autocomplete(element[0], options);
 
            google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
              var geoComponents = scope.gPlace.getPlace();
              var latitude = geoComponents.geometry.location.lat();
              var longitude = geoComponents.geometry.location.lng();
                scope.$parent.details =  {
                  lat: latitude,
                  lng: longitude
                };
                scope.$apply(function() {
                    model.$setViewValue(element.val());                
                });
            });
        }
    };
})

.controller('UseAddressCtrl', function($scope, $rootScope, $state, $location, $firebaseObject) {
  
 
 var geoCallback = function(error) {
   if(error) {
     console.log('Error');
   } else {
     console.log('Success');

   
     var fireBaseGeoRef = new Firebase(FIREBASE_GEO_REF);
      
      var geoFire = new GeoFire(fireBaseGeoRef);
     
     console.log('Geo');
     console.log(geoFire);
     
     var lat = parseFloat($scope.lat);
     var lng = parseFloat($scope.lng);
     //var stat = GEO_ID_PREFIX + postID;
    // console.log(stat);
     console.log(lat);
     console.log(lng);
     //var randomId = GEO_ID_PREFIX + $scope.generateRandomString(10);
     try {
      geoFire.set($scope.newPostRef.key(), [lat, lng]).then(function() {
        console.log("Provided key has been added to GeoFire");
      }, function(error) {
        console.log("Error: " + error);
      });  
     } catch (e) {
       console.log('error');
       console.log(e);
     }
      
      console.log('blah')
     
      //Go to the homepage
      
      $rootScope.$apply(function() {
        $location.path('/map');
      });
      
      
      console.log('Mapped');
      
      } 
 };
 
  
  var fireBaseFactRef = new Firebase(FIREBASE_FACT_REF);
  $scope.ref = fireBaseFactRef;
  
  // Create a GeoFire index
  
  
  $scope.lat = $location.$$search.lat;
  $scope.lng = $location.$$search.lng;
  $scope.fact = {};
  console.log($scope.lat);
  $scope.createFact = function() {
    //TODO
    console.log('Fact Type');
    console.log($scope);
    
    var sendObject = {
      'factType': $scope.fact.type,
      'factDetails': $scope.fact.details,
      'factName': $scope.fact.name
    };

    $scope.newPostRef = fireBaseFactRef.push();
    $scope.newPostRef.set(sendObject, geoCallback);
    
    //var postID = newPostRef.key();
    
     // var myID = "map-entry-" + $scope.generateRandomString(10);
     
     
    
  
    
  };
  
  $scope.generateRandomString = function(length) {
   var text = "";
      var validChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for(var i = 0; i < length; i++) {
          text += validChars.charAt(Math.floor(Math.random() * validChars.length));
      }

      return text;
 };
 
})

.controller('ViewFactCtrl', function($scope, $location) {
  
  
  $scope.factDetails = $location.$$search.factDetails;
   $scope.factName = $location.$$search.factName;
    $scope.factType = $location.$$search.factTypes;
    
  
  $scope.back = function() {
    $location.path('/map');
  };
})

.controller('CreateCtrl', function($scope, $location) {
  $scope.mapSelect = function() {
    $location.path('/selectMap');
  };
  $scope.useAddress = function() {
    console.log('Using Address');
    //var addressLink = '/useAddress?lat=' + $scope.details.lat + '&lng=' + $scope.details.lng;
    
    //console.log(addressLink);
    $location.path('/useAddress')
      .search({'lat': $scope.details.lat, 'lng': $scope.details.lng});
  };
})

.controller('MapSelectCtrl', function($scope, $cordovaGeolocation, $location) {
  
  var options = {timeout: 10000, enableHighAccuracy: true};
  
  $cordovaGeolocation.getCurrentPosition(options).then(function(position){
    
    $scope.currentPosition = {};
    
    
   var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
 
    $scope.lat = position.coords.latitude;
    $scope.lng = position.coords.longitude;
 
var mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      fullscreenControl: false,
      mapTypeControl: false,
      overviewMapControl: false,
      scaleControl: false,
      rotateControl: false,
      streetViewControl: false,
      zoomControl: false
    };
 
    $scope.map = new google.maps.Map(document.getElementById("mapSelect"), mapOptions);
    
    
    //Wait until the map is loaded
    google.maps.event.addListenerOnce($scope.map, 'idle', function(){
      
      //Get all events from this:
      console.log('Maps in Idle State');
      
      $scope.marker = new google.maps.Marker({
          map: $scope.map,
          animation: google.maps.Animation.DROP,
          position: latLng
      });      
    
      var infoWindow = new google.maps.InfoWindow({
          content: "Your current location"
      });
    
      google.maps.event.addListener($scope.marker, 'click', function () {
          infoWindow.open($scope.map, $scope.marker);
      });
    
    }); 
    
    $scope.map.addListener('click', function(e) {
      
      $scope.marker.setMap(null);
      //Clear all markers some how?
      $scope.marker = new google.maps.Marker({
        position: {lat: e.latLng.lat(), lng: e.latLng.lng()},
        map: $scope.map
      });
      
      //firebaseRef.push({lat: e.latLng.lat(), lng: e.latLng.lng()});
      $scope.lat = parseFloat(e.latLng.lat());
      $scope.lng = parseFloat(e.latLng.lng());
      
    }); 
 
  }, function(error){
    console.log("Could not get location");
  });
  
  $scope.selectedAddress = function() {
     $location.path('/useAddress')
      .search({'lat': $scope.lat, 'lng': $scope.lng});
  };
})

.controller('FirstLoadCtrl', function($scope, $window, $location) {
  //Now set so we don't show again
  $window.localStorage['initialRun'] = 'true';
  
  
  $scope.finish = function() {
    $location.path('/map');
  };
  
})

.controller('InitialCtrl', function($scope, $window, $location) {
  var value = $window.localStorage['initialRun'] || 'false';
  console.log('el');
  if(value === 'true') {
    console.log('true');
    $location.path('/map');
  } else {
    console.log('false');
    $location.path('/firstLoad');
  } 
})


.controller('MapCtrl', function($scope, $rootScope, $state, $cordovaGeolocation, $firebaseObject,
    $location) {
  var options = {timeout: 10000, enableHighAccuracy: true};
  
  var firebaseRef = new Firebase(FIREBASE_GEO_REF);
  
  // Create a GeoFire index
  var geoFire = new GeoFire(firebaseRef);
 
 
 $scope.addToMap = function(infoCard) {
   var details = infoCard.details;
   console.log(details);
   var type = details.factType;
   var iconImage = 'img/MapIconHistory.png';
   if(type.indexOf('Movie') > -1) {
     iconImage = 'img/MapIconMovie.png';
   } else if(type.indexOf('Music') > -1) {
     iconImage = 'img/MapIconMusic.png';
   } else if(type.indexOf('Person') > -1) {
     iconImage = 'img/MapIconPerson.png';
   } else if(type.indexOf('Unknown') > -1) {
     iconImage = 'img/MapIconUnknown.png';
   }  else if(type.indexOf('History') > -1) {
     iconImage = 'img/MapIconHistory.png';
   }
   
   
   var marker = new google.maps.Marker({
        map: $scope.map,
        animation: google.maps.Animation.DROP,
        position:  {lat: infoCard.location[0], lng: infoCard.location[1]},
        icon: iconImage
    });
    
    google.maps.event.addListener(marker, 'click', function () {
      console.log('Clicked!');
      $rootScope.$apply(function() {
        $location.path('/viewFact').search(infoCard.details);
      });
    }.bind(this));
      
 };
 
 $scope.addElement = function() {
   $location.path('/create');
 };
 
 $scope.generateRandomString = function(length) {
   var text = "";
      var validChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for(var i = 0; i < length; i++) {
          text += validChars.charAt(Math.floor(Math.random() * validChars.length));
      }

      return text;
 };
 
  $cordovaGeolocation.getCurrentPosition(options).then(function(position){
 
    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
 
    var mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      fullscreenControl: false,
      mapTypeControl: false,
      overviewMapControl: false,
      scaleControl: false,
      rotateControl: false,
      streetViewControl: false,
      zoomControl: false
    };
 
    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
    
    
    //Wait until the map is loaded
    google.maps.event.addListenerOnce($scope.map, 'idle', function(){
      
      //Get all events from this:
      console.log('Maps in Idle State');
      
      var marker = new google.maps.Marker({
          map: $scope.map,
          animation: google.maps.Animation.DROP,
          position: latLng
      });      
    
      var infoWindow = new google.maps.InfoWindow({
          content: "This is where you are at the moment"
      });
    
      google.maps.event.addListener(marker, 'click', function () {
          infoWindow.open($scope.map, marker);
      });
    
    }); 
    
    
    /*
    $scope.map.addListener('click', function(e) {
      var marker = new google.maps.Marker({
        position: {lat: e.latLng.lat(), lng: e.latLng.lng()},
        map: $scope.map
      });
      
      //firebaseRef.push({lat: e.latLng.lat(), lng: e.latLng.lng()});
      
     
      
    }); 
    
    */
    
          
      var geoQuery = geoFire.query({
        center: [position.coords.latitude, position.coords.longitude],
        radius: 10.5 //Distance in Kilometers from the center
      });
      
      
       geoQuery.on('key_entered', function(key, location, distance) {
          
          
          // Get details for more infoCard
         // var id = key.substring(GEO_ID_PREFIX.length);
          //console.log('id is ' + id + ', key was ' + key);
          new Firebase(FIREBASE_FACT_REF + key).once('value', function(details) {
            var oneSeller = { 
                  id: key,
                  distance: distance,
                  location: location,
                  details: details.val()
              };
            console.log('One Seller');
            console.log(oneSeller);
            $scope.addToMap(oneSeller);
          });
      });  

 
  }, function(error){
    console.log("Could not get location");
  });
})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});
