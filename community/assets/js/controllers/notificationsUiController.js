'use strict';

/* Controllers */

angular.module('app', ['ui.select'])
    .controller('notificationCtrl', ['$scope', '$http', '$localStorage', '$state', '$sce', '$compile', 'fileUploadService', function($scope, $http, $localStorage, $state, $sce, $compile, fileUploadService) {

        if(!$localStorage.loggedIn || $localStorage.isActive != 1){
            //User is not logged in. Redirect the user to login page
            $state.go('access.login', {});
        } else {
            $scope.companyId = $localStorage.companyId;
        }

        $http({
            method : "GET",
            url : "assets/scripts/getNotifications.php",
            params: {companyId: $scope.companyId},
            headers: {'Cache-Control':'no-cache', 'Pragma':'no-cache'},
            cache: false
        }).then(function mySuccess(response) {
            $scope.notifications = response.data;
        }, function myError(response) {
            $scope.message = response.message;
        });
        
        $scope.deleteNotification = function(index, notificationId){
            var method = "POST";
            var url = "assets/scripts/deleteNotification.php";
            var data = {companyId: $scope.companyId, notificationId: notificationId};

            $http({
                method: method,
                url: url,
                data: data,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function mySuccess(response) {
                $scope.notifications.splice(index, 1);
            }, function myError(response) {
                window.alert("Issue in deleting notification");
            });
        }
        
        $scope.showNotification = function(){
            $scope.notification = {};
            $('#addNotificationModal').modal('show');
        }
        
        $scope.addNotification = function(){
            var uploadUrl = "assets/scripts/addNotification.php", //Url of webservice/api/server
                promise = fileUploadService.uploadFileToUrl($scope.file, uploadUrl, $scope.companyId, $scope.notification);
 
            promise.then(function (response) {
                //Item addition successful. Update array objects
                if(response.flag == 1){
                        $scope.notifications.push({
                            notificationId: response.notificationId,
                            imageUrl: response.imageUrl,
                            notification: $scope.notification.notification,
                            description: $scope.notification.description,
                            pushDate: $scope.notification.pushDate,
                            pushTime: $scope.notification.pushTime,
                        });
                        $('#addNotificationModal').modal('hide');
                }else{
                        $scope.message = response.message;
                        window.alert("Error in adding notification");
                    }
            }, function () {
                $scope.serverResponse = 'An error has occurred';
            })
        }

        $scope.editNotification = function(index, item){
            $scope.notification = {
                    notificationId: item.notificationId,
                    notification: item.notification,
                    description: item.description,
                    imageUrl: item.imageUrl,
                    pushDate: item.pushDate,
                    pushTime: item.pushTime
            };
            $('#editNotificationModal').modal('show');
        }
        
        $scope.updateNotification = function(){
            var uploadUrl = "assets/scripts/updateNotification.php", //Url of webservice/api/server
                promise = fileUploadService.uploadFileToUrl($scope.file, uploadUrl, $scope.companyId, $scope.notification);
            
            promise.then(function(response) {
                if(response.flag == 1){
                    //Item updation successful. Update array objects
                    var index = $scope.notifications.findIndex(x=>x.notificationId == $scope.notification.notificationId);
                    if(index > -1){
                        $scope.notifications[index].notification = $scope.notification.notification;
                        $scope.notifications[index].description = $scope.notification.description;
                        $scope.notifications[index].pushDate = $scope.notification.pushDate;
                        $scope.notifications[index].pushTime = $scope.notification.pushTime;
                        if(response.imageUrl){
                            $scope.notifications[index].imageUrl = response.imageUrl;
                        }
                    }
                    $('#editNotificationModal').modal('hide');
                }else{
                    $scope.message = response.message;
                    window.alert("Error in updating notification");
                }
            }, function () {
                $scope.serverResponse = 'An error has occurred';
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
        this.uploadFileToUrl = function (file, uploadUrl, companyId, notification) {
            //FormData, object of key/value pair for form fields and values
            var fileFormData = new FormData();
            fileFormData.append('file', file);
            fileFormData.append('companyId', companyId);
            fileFormData.append('notification', angular.toJson(notification, true));
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
