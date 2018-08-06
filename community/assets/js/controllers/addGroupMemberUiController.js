'use strict';

/* Controllers */

angular.module('app', ['ui.select'])
    .controller('addGroupMemberCtrl', ['$scope', '$http', '$localStorage', '$state', '$sce', '$compile', 'fileUploadService', function($scope, $http, $localStorage, $state, $sce, $compile, fileUploadService) {

        if(!$localStorage.loggedIn || $localStorage.isActive != 1){
            //User is not logged in. Redirect the user to login page
            $state.go('access.login', {});
        } else {
            $scope.companyId = $localStorage.companyId;
        }
        
        $scope.trustAsHtml = function (value) {
            return $sce.trustAsHtml(value);
        };
        
        $scope.subscribers = [];
        $scope.subscriber = {};
        $scope.parentName = {};
        $scope.spouseName = {};
        $scope.maritalStatuses = [];
        $scope.maritalStatus = {};
        $scope.educations = [];
        $scope.education = {};
        $scope.degrees = [];
        $scope.degree = {};
        
        $http({
            method : "GET",
            url : "assets/scripts/getSubscribers.php",
            params: {companyId: $scope.companyId},
            headers: {'Cache-Control':'no-cache', 'Pragma':'no-cache'},
            cache: false
        }).then(function mySuccess(response) {
            $scope.subscribers = response.data;
        }, function myError(response) {
            $scope.message = response.message;
        });
        
        $http({
            method : "GET",
            url : "assets/scripts/getMaritalStatus.php",
            params: {},
            headers: {'Cache-Control':'no-cache', 'Pragma':'no-cache'},
            cache: false
        }).then(function mySuccess(response) {
            $scope.maritalStatuses = response.data;
        }, function myError(response) {
            $scope.message = response.message;
        });
        
        $http({
            method : "GET",
            url : "assets/scripts/getEducation.php",
            params: {},
            headers: {'Cache-Control':'no-cache', 'Pragma':'no-cache'},
            cache: false
        }).then(function mySuccess(response) {
            $scope.educations = response.data;
        }, function myError(response) {
            $scope.message = response.message;
        });
        
        $http({
            method : "GET",
            url : "assets/scripts/getDegree.php",
            params: {},
            headers: {'Cache-Control':'no-cache', 'Pragma':'no-cache'},
            cache: false
        }).then(function mySuccess(response) {
            $scope.degrees = response.data;
        }, function myError(response) {
            $scope.message = response.message;
        });
        
        $scope.createGroupMember = function(){

            if($scope.parentName.selected){
                $scope.subscriber.parentId = $scope.parentName.selected.subscriberId;
            }
            
            if($scope.spouseName.selected){
                $scope.subscriber.spouseId = $scope.spouseName.selected.subscriberId;
            }
            
            if($scope.maritalStatus.selected){
                $scope.subscriber.maritalStatusId = $scope.maritalStatus.selected.maritalStatusId;
            }
            
            if($scope.education.selected){
                $scope.subscriber.educationId = $scope.education.selected.educationId;
            }
            if($scope.degree.selected){
                $scope.subscriber.degreeId = $scope.degree.selected.degreeId;
            }
            var uploadUrl = "assets/scripts/addSubscriber.php", //Url of webservice/api/server
                promise = fileUploadService.uploadFileToUrl($scope.file, uploadUrl, $scope.companyId, $scope.subscriber);
 
            promise.then(function (response) {
                //Item addition successful. Update array objects
                    if(response.flag == 1){
                        window.alert("Group Member successfully added!");
                        $state.go('app.groupMembers', {});
                    }else{
                        $scope.message = response.message;
                        window.alert("Error in creating Group Member");
                        
                    }
            }, function () {
                $scope.serverResponse = 'An error has occurred.';
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
    
angular.module('app')
    .directive('demoFileModel', function ($parse) {
        return {
            restrict: 'A', //the directive can be used as an attribute only
            /*
             link is a function that defines functionality of directive
             scope: scope associated with the element
             element: element on which this directive used
             attrs: key value pair of element attributes
             */
            link: function (scope, element, attrs) {
                var model = $parse(attrs.demoFileModel),
                    modelSetter = model.assign; //define a setter for demoFileModel

                //Bind change event on the element
                element.bind('change', function () {
                    //Call apply on scope, it checks for value changes and reflect them on UI
                    scope.$apply(function () {
                        //set the model value
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    })
    
angular.module('app')
    .service('fileUploadService', function ($http, $q) {
        this.uploadFileToUrl = function (file, uploadUrl, companyId, subscriber) {
            //FormData, object of key/value pair for form fields and values
            var fileFormData = new FormData();
            fileFormData.append('file', file);
            fileFormData.append('companyId', companyId);
            fileFormData.append('subscriber', angular.toJson(subscriber, true));
            var deffered = $q.defer();
            $http.post(uploadUrl, fileFormData, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).success(function (response) {
                deffered.resolve(response);
            }).error(function (response) {
                deffered.reject(response);
            });

            return deffered.promise;
        }
    })