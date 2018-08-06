'use strict';

/* Controllers */

angular.module('app', ['ui.select'])
    .controller('feedbacksCtrl', ['$scope', '$http', '$localStorage', '$state', '$sce', '$compile', function($scope, $http, $localStorage, $state, $sce, $compile) {

        if(!$localStorage.loggedIn || $localStorage.isActive != 1){
            //User is not logged in. Redirect the user to login page
            $state.go('access.login', {});
        } else {
            $scope.companyId = $localStorage.companyId;
        }
        
        $scope.trustAsHtml = function (value) {
            return $sce.trustAsHtml(value);
        };
        
        $scope.feedbacks = [];
        
        $http({
            method : "GET",
            url : "assets/scripts/getFeedback.php",
            params: {companyId: $scope.companyId},
            headers: {'Cache-Control':'no-cache', 'Pragma':'no-cache'},
            cache: false
        }).then(function mySuccess(response) {
            $scope.feedbacks = response.data;
        }, function myError(response) {
            $scope.message = response.message;
        });
        
        $scope.approveFeedback = function(index, item){
            
            var method = "POST";
            var url = "assets/scripts/approveFeedback.php";
            var data = {feedbackId: item.feedbackId};
            
            $http({
                method: method,
                url: url,
                data: data,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function addSuccess(response) {
                if(response.data.flag == 1){
                    item.isApproved = !item.isApproved;
                }
                else{
                    window.alert(response.data.message);
                }
            }, function addError(response) {
                $scope.message = response.message;
                window.alert("Error in approving feedback");
            });
        };
        
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
                              scope.$eval(clickAction);
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
