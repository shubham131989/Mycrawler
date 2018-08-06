'use strict';

/* Controllers */

angular.module('app', ['ui.select'])
    .controller('addEventCtrl', ['$scope', '$http', '$localStorage', '$state', '$sce', '$compile', function($scope, $http, $localStorage, $state, $sce, $compile) {

        if(!$localStorage.loggedIn || $localStorage.isActive != 1){
            //User is not logged in. Redirect the user to login page
            $state.go('access.login', {});
        } else {
            $scope.companyId = $localStorage.companyId;
        }
        
        $scope.trustAsHtml = function (value) {
            return $sce.trustAsHtml(value);
        };
        
        $scope.venues = [];
        $scope.venue = {};
        $scope.event = {};
        
        $http({
            method : "GET",
            url : "assets/scripts/getVenues.php",
            params: {companyId: $scope.companyId},
            headers: {'Cache-Control':'no-cache', 'Pragma':'no-cache'},
            cache: false
        }).then(function mySuccess(response) {
            $scope.venues = response.data;
        }, function myError(response) {
            $scope.message = response.message;
        });
        
        $scope.createEvent = function(){
            
            var method = "POST";
            var url = "assets/scripts/addEvent.php";
            var data = {companyId: $scope.companyId, venueId: $scope.venue.selected.venueId, event: $scope.event};
            
            console.log(data);
            
            $http({
                method: method,
                url: url,
                data: data,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function addSuccess(response) {
                console.log(response);
                if(response.data.flag == 1){
                    window.alert("Event successfully created");
                    $state.go('app.events', {});
                }
            }, function addError(response) {
                $scope.message = response.message;
                window.alert("Error in creating event");
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
      }])
    .directive('timepicker', function() {
        return {
            restrict: 'A',
            link: function(scope, elem, attrs) {
                $(elem).timepicker().on('show.timepicker', function(e) {
                    var widget = $('.bootstrap-timepicker-widget');
                    widget.find('.glyphicon-chevron-up').removeClass().addClass('pg-arrow_maximize');
                    widget.find('.glyphicon-chevron-down').removeClass().addClass('pg-arrow_minimize');
                });
            }
        }
    });
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