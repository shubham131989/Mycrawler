'use strict';

/* Controllers */

angular.module('app', ['ui.select', 'gm'])
    .controller('venueCtrl', ['$scope', '$http', '$localStorage', '$state', '$sce', '$compile', function($scope, $http, $localStorage, $state, $sce, $compile) {

        if(!$localStorage.loggedIn || $localStorage.isActive != 1){
            //User is not logged in. Redirect the user to login page
            $state.go('access.login', {});
        } else {
            $scope.catererId = $localStorage.catererId;
        }

        $http({
            method : "GET",
            url : "assets/scripts/getVenues.php",
            params: {catererId: $scope.catererId},
            headers: {'Cache-Conrol':'no-cache', 'Pragma':'no-cache'},
            cache: false
        }).then(function mySuccess(response) {
            $scope.venues = response.data;
        }, function myError(response) {
            $scope.message = response.message;
        });
        
        $scope.deleteItem = function(index, venueId){
            var method = "POST";
            var url = "assets/scripts/deleteVenue.php";
            var data = {catererId: $scope.catererId, venueId: venueId};

            $http({
                method: method,
                url: url,
                data: data,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function mySuccess(response) {
                $scope.venues.splice(index, 1);
            }, function myError(response) {
                window.alert("Issue in deleting venue");
            });
        }
        
        $scope.showVenue = function(){
            $scope.venue = {};
            $scope.address = {};
            $('#addVenueModal').modal('show');
        }
        
        $scope.addVenue = function(){
            var method = "POST";
            var url = "assets/scripts/addVenue.php";
            var data = {catererId: $scope.catererId, venue: $scope.venue, address:$scope.address};

            $http({
                method: method,
                url: url,
                data: data,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function addSuccess(response) {
                $scope.venue.venueId = response.data.venueId;

                $scope.venues.unshift({
                    venueId: $scope.venue.venueId,
                    venueName: $scope.venue.venueName,
                    contactNo: $scope.venue.contactNo,
                    emailId: $scope.venue.emailId,
                    website: $scope.venue.website,
                    line1: $scope.address.line1,
                    line2: $scope.address.line2,
                    latitude: $scope.address.latitude,
                    longitude: $scope.address.longitude,
                    placeId: $scope.address.placeId,
                    zipcode: $scope.address.zipcode,
                    city: $scope.address.city,
                    state: $scope.address.state,
                    stateCode: $scope.address.stateCode,
                    country: $scope.address.country,
                    countryCode: $scope.address.countryCode
                });
                $('#addVenueModal').modal('hide');
            }, function addError(response) {
                $scope.message = response.message;
                window.alert("Error in adding venue");
            });
        }
        
        $scope.editVenue = function(index, item){
            $scope.venue = {
                venueId: item.venueId,
                venueName: item.venueName,
                contactNo: item.contactNo,
                emailId: item.emailId,
                website: item.website
            };
            $scope.address = {
                line1: item.line1,
                line2: item.line2,
                latitude: item.latitude,
                longitude: item.longitude,
                placeId: item.placeId,
                zipcode: item.zipcode,
                city: item.city,
                state: item.state,
                stateCode: item.stateCode,
                country: item.country,
                countryCode: item.countryCode
            };
            $('#editVenueModal').modal('show');
        }
        
        $scope.updateVenue = function(){
            var method = "POST";
            var url = "assets/scripts/updateVenue.php";
            var data = {catererId: $scope.catererId, venue: $scope.venue, address: $scope.address};
            
            $http({
                method: method,
                url: url,
                data: data,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function addSuccess(response) {
                var index = $scope.venues.findIndex(x=>x.venueId == $scope.venue.venueId);
                if(index > -1){
                    $scope.venues[index] = {
                        venueId: $scope.venue.venueId,
                        venueName: $scope.venue.venueName,
                        contactNo: $scope.venue.contactNo,
                        emailId: $scope.venue.emailId,
                        website: $scope.venue.website,
                        line1: $scope.address.line1,
                        line2: $scope.address.line2,
                        latitude: $scope.address.latitude,
                        longitude: $scope.address.longitude,
                        placeId: $scope.address.placeId,
                        zipcode: $scope.address.zipcode,
                        city: $scope.address.city,
                        state: $scope.address.state,
                        stateCode: $scope.address.stateCode,
                        country: $scope.address.country,
                        countryCode: $scope.address.countryCode
                    };
                }
                $('#editVenueModal').modal('hide');
            }, function addError(response) {
                $scope.message = response.message;
                window.alert("Error in updating venue");
            });
        }
        
        $scope.$on('gmPlacesAutocomplete::placeChanged', function(){
          var place = $scope.address.line1.getPlace();
          $scope.address.line1 = place.formatted_address;
          $scope.address.latitude = place.geometry.location.lat();
          $scope.address.longitude = place.geometry.location.lng();
          $scope.address.placeId = place.place_id;
          if(!$scope.venue.venueName){
              $scope.venue.venueName = place.name;
          }
          if(place.formatted_phone_number && !$scope.venue.contactNo){
              $scope.venue.contactNo = place.formatted_phone_number.replace(/\s/g,'');
          }
          if(place.website && !$scope.venue.website){
              $scope.venue.website = place.website;
          }
          //Get city, state, country and zipcode for the address
          for(var i = 0; i < place.address_components.length; i++){
              var component = place.address_components[i];
              switch(component.types[0]){
                  case 'locality':
                      $scope.address.city = component.long_name;
                      break;
                  case 'administrative_area_level_1':
                      $scope.address.state = component.long_name;
                      $scope.address.stateCode = component.short_name;
                      break;
                  case 'country':
                      $scope.address.country = component.long_name;
                      $scope.address.countryCode = component.short_name;
                      break;
                  case 'postal_code':
                      $scope.address.zipcode = component.long_name;
                      break;
              }
          }
          $scope.$apply();
        });
        
        $scope.export = function(){
            $("#tableWithDynamicRows").table2excel({
        		exclude: ".noExl",
        		name: "Venues",
        		filename: "Venues"
        	});
        }
        
    }]);
angular.module('app')
    .directive('ngConfirmClick', [
          function(){
              return {
                  link: function (scope, element, attr) {
                      var msg = attr.ngConfirmClick || "Are you sure?";
                      var clickAction = attr.confirmedClick;
                      element.bind('click',function (event) {
                          if ( window.confirm(msg) ) {
                              scope.$eval(clickAction)
                          }
                      });
                  }
              };
      }]);
/**
 * AngularJS default filter with the following expression:
 * "person in people | filter: {name: $select.search, age: $select.search}"
 * performs a AND between 'name: $select.search' and 'age: $select.search'.
 * We want to perform a OR.
 */
angular.module('app')
    .filter('propsFilter', function () {
        return function (items, props) {
            var out = [];

            if (angular.isArray(items)) {
                items.forEach(function (item) {
                    var itemMatches = false;

                    var keys = Object.keys(props);
                    for (var i = 0; i < keys.length; i++) {
                        var prop = keys[i];
                        var text = props[prop].toLowerCase();
                        if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                            itemMatches = true;
                            break;
                        }
                    }

                    if (itemMatches) {
                        out.push(item);
                    }
                });
            } else {
                // Let the output be the input untouched
                out = items;
            }

            return out;
        };
    });