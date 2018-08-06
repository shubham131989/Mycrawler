'use strict';

/* Controllers */

angular.module('app', ['ui.select'])
    .controller('offerCtrl', ['$scope', '$http', '$localStorage', '$state', '$sce', '$compile', 'fileUploadService', function($scope, $http, $localStorage, $state, $sce, $compile, fileUploadService) {

        if(!$localStorage.loggedIn || $localStorage.isActive != 1){
            //User is not logged in. Redirect the user to login page
            $state.go('access.login', {});
        } else {
            $scope.companyId = $localStorage.companyId;
        }

        $http({
            method : "GET",
            url : "assets/scripts/getOffers.php",
            params: {companyId: $scope.companyId},
            headers: {'Cache-Control':'no-cache', 'Pragma':'no-cache'},
            cache: false
        }).then(function mySuccess(response) {
            $scope.offers = response.data;
        }, function myError(response) {
            $scope.message = response.message;
        });
        
        $scope.deleteOffer = function(index, offerId){
            var method = "POST";
            var url = "assets/scripts/deleteOffer.php";
            var data = {companyId: $scope.companyId, offerId: offerId};

            $http({
                method: method,
                url: url,
                data: data,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function mySuccess(response) {
                $scope.offers.splice(index, 1);
            }, function myError(response) {
                window.alert("Issue in deleting offer");
            });
        }
        
        $scope.showOffer = function(){
            $scope.offer = {};
            $('#addOfferModal').modal('show');
        }
        
        $scope.addOffer = function(){
            
            var uploadUrl = "assets/scripts/addOffer.php", //Url of webservice/api/server
                promise = fileUploadService.uploadFileToUrl($scope.file, uploadUrl, $scope.companyId, $scope.offer);
 
            promise.then(function (response) {
                //Item addition successful. Update array objects
                $scope.offers.push({
                    offerId: response.offerId,
                    imageUrl: response.imageUrl,
                    offer: $scope.offer.offer,
                    description: $scope.offer.description,
                    startDate: $scope.offer.startDate,
                    startTime: $scope.offer.startTime,
                    endDate: $scope.offer.endDate,
                    endTime: $scope.offer.endTime
                });
                $('#addOfferModal').modal('hide');
            }, function () {
                $scope.serverResponse = 'An error has occurred';
            })
        }
        
        $scope.editOffer = function(index, item){
            $scope.offer = {
                offerId : item.offerId,
                offer : item.offer,
                description : item.description,
                startDate : item.startDate,
                startTime : item.startTime,
                endDate : item.endDate,
                endTime : item.endTime,
            };
            $('#editOfferModal').modal('show');
        }
        
        $scope.updateOffer = function(){
            var uploadUrl = "assets/scripts/updateOffer.php", //Url of webservice/api/server
                promise = fileUploadService.uploadFileToUrl($scope.file, uploadUrl, $scope.companyId, $scope.offer);
 
            promise.then(function(response) {
                //Item updation successful. Update array objects
                var index = $scope.offers.findIndex(x=>x.offerId == $scope.offer.offerId);
                if(index > -1){
                    if(response.imageUrl){
                        $scope.offers[index].imageUrl = response.imageUrl;
                    }
                    $scope.offers[index].offer = $scope.offer.offer;
                    $scope.offers[index].description = $scope.offer.description;
                    $scope.offers[index].startDate = $scope.offer.startDate;
                    $scope.offers[index].startTime = $scope.offer.startTime;
                    $scope.offers[index].endDate = $scope.offer.endDate;
                    $scope.offers[index].endTime = $scope.offer.endTime;
                }
                $('#editOfferModal').modal('hide');
            }, function () {
                $scope.serverResponse = 'An error has occurred';
            })
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
        this.uploadFileToUrl = function (file, uploadUrl, companyId, offer) {
            //FormData, object of key/value pair for form fields and values
            var fileFormData = new FormData();
            fileFormData.append('file', file);
            fileFormData.append('companyId', companyId);
            fileFormData.append('offer', angular.toJson(offer, true));
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