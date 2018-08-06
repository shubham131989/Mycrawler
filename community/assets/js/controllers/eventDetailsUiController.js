'use strict';

/* Controllers */
angular.module('app', ['ui.select', 'ngDropzone'])
    .controller('eventDetailsCtrl', ['$scope', '$http', '$localStorage', '$state', '$sce', '$compile', '$stateParams', function($scope, $http, $localStorage, $state, $sce, $compile, $stateParams) {

        if(!$localStorage.loggedIn || $localStorage.isActive != 1){
            //User is not logged in. Redirect the user to login page
            $state.go('access.login', {});
        } else {
            $scope.companyId = $localStorage.companyId;
            $scope.eventId = $stateParams.eventId;
        }
        
        $scope.trustAsHtml = function (value) {
            return $sce.trustAsHtml(value);
        };
        
        $scope.dropzone = {};
        $scope.venues = [];
        $scope.venue = {};
        $scope.event = {};
        $scope.eventRsvps = [];
        $scope.eventGallery = [];
        $scope.feedbacks = [];
        
        $scope.dzConfig = {
            parallelUploads: 3,
            maxFileSize: 30,
            url: 'assets/scripts/addEventGallery.php',
            addRemoveLinks: true,
            acceptedFiles: "image/*",
            params: {
                eventId : $scope.eventId
            },
            init: function() {
                var dropbox = this;
                  var method = "POST";
                    var url = "assets/scripts/addEventGallery.php";
                    var data = {eventId: $scope.eventId};
                    
                    $http({
                        method: method,
                        url: url,
                        data: data,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(function mySuccess(response) {
                        console.log(response);
                        if(response.data.flag == 1){
                            response.data.images = angular.fromJson(response.data.images,true);
                            
                            for (var i = 0; i < response.data.images.length; i++) {
                              var element = response.data.images[i];
                              console.log(element);
                              var mockFile = { name: element.name, size: element.size };
                              dropbox.emit("addedfile", mockFile);
                              dropbox.emit("thumbnail", mockFile, "assets/img/events/"+$scope.eventId+"/"+element.name);
                            }
                        }
                    }, function myError(response) {
                        $scope.message = response.message;
                        window.alert("Error in deleting file.");
                    });
                
                this.on("success", function(file, response) { 
                    alert("Added file"+file);
                    response = angular.fromJson(response, true);
                    $scope.eventGallery.push(response.eventGallery);
                    file.eventGalleryId = response.eventGallery.eventGalleryId;
                });
                this.on("removedfile", function(file) {
                    alert("Removed file: "+file.name);
                    
                    var method = "POST";
                    var url = "assets/scripts/deleteEventGallery.php";
                    var data = {eventId: $scope.eventId, eventGalleryId: file.eventGalleryId, fileName: file.name};
                    
                    $http({
                        method: method,
                        url: url,
                        data: data,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(function mySuccess(response) {
                        if(response.data.flag == 1){
                            var index = $scope.eventGallery.findIndex(x=>x.eventGalleryId == file.eventGalleryId);
                            if(index > -1){
                                $scope.eventGallery.splice(index, 1);
                            }
                        }
                    }, function myError(response) {
                        $scope.message = response.message;
                        window.alert("Error in deleting file.");
                    });
                });
            },
        };
    
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
        
        $http({
            method : "GET",
            url : "assets/scripts/getEventDetails.php",
            params: {companyId: $scope.companyId, eventId: $scope.eventId},
            headers: {'Cache-Control':'no-cache', 'Pragma':'no-cache'},
            cache: false
        }).then(function mySuccess(response) {
            $scope.venue.selected = response.data.venue;
            $scope.event = response.data.event;
            $scope.eventRsvps = response.data.eventRsvp;
            $scope.eventGallery = response.data.eventGallery;
            $scope.feedbacks = response.data.feedback;
            
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
        
        $scope.addEventGallery = function(){
            
        }
        
        $scope.updateEvent = function(){
            var method = "POST";
            var url = "assets/scripts/updateEvent.php";
            var data = {companyId: $scope.companyId, venueId: $scope.venue.selected.venueId, event: $scope.event};

            $http({
                method: method,
                url: url,
                data: data,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function addSuccess(response) {
                if(response.data.flag == 1){
                    window.alert("Event successfully updated");
                    $state.go('app.events', {});
                }
            }, function addError(response) {
                $scope.message = response.message;
                window.alert("Error in updating event");
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