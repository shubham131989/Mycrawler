'use strict';

/* Controllers */

angular.module('app', ['ui.select', 'gm'])
    .controller('eventCtrl', ['$scope', '$http', '$localStorage', '$state', '$sce', '$compile', function($scope, $http, $localStorage, $state, $sce, $compile) {

        if(!$localStorage.loggedIn || $localStorage.isActive != 1){
            //User is not logged in. Redirect the user to login page
            $state.go('access.login', {});
        } else {
            $scope.catererId = $localStorage.catererId;
        }

        $http({
            method : "GET",
            url : "assets/scripts/getEvents.php",
            params: {catererId: $scope.catererId},
            headers: {'Cache-Conrol':'no-cache', 'Pragma':'no-cache'},
            cache: false
        }).then(function mySuccess(response) {
            $scope.events = response.data;
        }, function myError(response) {
            $scope.message = response.message;
        });
        
        $scope.deleteEvent = function(index, eventId){
            var method = "POST";
            var url = "assets/scripts/deleteEvent.php";
            var data = {catererId: $scope.catererId, eventId: eventId};

            $http({
                method: method,
                url: url,
                data: data,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function mySuccess(response) {
                $scope.events.splice(index, 1);
            }, function myError(response) {
                window.alert("Issue in deleting event");
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