'use strict';

/* Controllers */

angular.module('app', ['ui.select'])
    .controller('businessesCtrl', ['$scope', '$http', '$localStorage', '$state', '$sce', '$compile', 'fileUploadService', function($scope, $http, $localStorage, $state, $sce, $compile, fileUploadService) {

        if(!$localStorage.loggedIn || $localStorage.isActive != 1){
            //User is not logged in. Redirect the user to login page
            $state.go('access.login', {});
        } else {
            $scope.companyId = $localStorage.companyId;
        }
        
        $scope.trustAsHtml = function (value) {
            return $sce.trustAsHtml(value);
        };
        
        $scope.businesses = [];
        $scope.subscribers = [];
        $scope.subscriber = {};

        $http({
            method : "GET",
            url : "assets/scripts/getBusinesses.php",
            params: {companyId: $scope.companyId},
            headers: {'Cache-Control':'no-cache', 'Pragma':'no-cache'},
            cache: false
        }).then(function mySuccess(response) {
            $scope.businesses = response.data;
        }, function myError(response) {
            $scope.message = response.message;
        });
        
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
        
        $scope.deleteBusiness = function(index, businessId){
            var method = "POST";
            var url = "assets/scripts/deleteBusiness.php";
            var data = {companyId: $scope.companyId, businessId: businessId};

            $http({
                method: method,
                url: url,
                data: data,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function mySuccess(response) {
                $scope.businesses.splice(index, 1);
            }, function myError(response) {
                window.alert("Issue in deleting business");
            });
        }
        
        $scope.showBusiness = function(){
            $scope.business = {};
            $scope.businessAddress = {};
            $('#addBusinessModal').modal('show');
        };
        
        $scope.addBusiness = function(){
            
            if($scope.subscriber.selected){
                $scope.business.subscriberId = $scope.subscriber.selected.subscriberId;
            }
            var uploadUrl = "assets/scripts/addBusiness.php", //Url of webservice/api/server
                promise = fileUploadService.uploadFileToUrl($scope.file, uploadUrl, $scope.companyId, $scope.business, $scope.businessAddress);
 
            promise.then(function (response) {
                //Item addition successful. Update array objects
                if(response.flag == 1){
                        $scope.businesses.push({
                            businessId: response.businessId,
                            subscriberId: $scope.business.subscriberId,
                            subscriberName: $scope.subscriber.selected.subscriberName,
                            businessName: $scope.business.businessName,
                            contactNo: $scope.business.contactNo,
                            alternateNo: $scope.business.alternateNo,
                            whatsapp: $scope.business.whatsapp,
                            emailId: $scope.business.emailId,
                            website: $scope.business.website,
                            logoUrl: response.logoUrl,
                            businessAddressId: response.businessAddressId,
                            line1: $scope.businessAddress.line1,
                            line2: $scope.businessAddress.line2
                        });
                        $('#addBusinessModal').modal('hide');
                }else{
                        $scope.message = response.message;
                        window.alert("Error in adding business");
                    }
            }, function () {
                $scope.serverResponse = 'An error has occurred';
            });
            
        }
        
        $scope.editBusiness = function(index, item){
            var index2 = $scope.subscribers.findIndex(x=>x.subscriberId == item.subscriberId);
            if(index2 > -1){
                $scope.subscriber.selected = $scope.subscribers[index2];
            }
            $scope.business = {
                    businessId: item.businessId,
                    subscriberId: item.subscriberId,
                    businessName: item.businessName,
                    contactNo: item.contactNo,
                    website: item.website,
                    logoUrl: item.logoUrl,
                    emailId: item.emailId,
                    alternateNo: item.alternateNo,
                    whatsapp: item.whatsapp
            };
            $scope.businessAddress ={
                businessAddressId: item.businessAddressId,
                line1: item.line1,
                line2: item.line2
            };
            $('#editBusinessModal').modal('show');
        };
        
        $scope.updateBusiness = function(){
            
            if($scope.subscriber.selected){
                $scope.business.subscriberId = $scope.subscriber.selected.subscriberId;
            }
            var uploadUrl = "assets/scripts/updateBusiness.php", //Url of webservice/api/server
            promise = fileUploadService.uploadFileToUrl($scope.file, uploadUrl, $scope.companyId, $scope.business, $scope.businessAddress);
            promise.then(function(response) {
                if(response.flag == 1){
                    //Item updation successful. Update array objects
                    var index = $scope.businesses.findIndex(x=>x.businessId == $scope.business.businessId);
                    if(index > -1){
                        $scope.businesses[index].subscriberId = $scope.business.subscriberId;
                        $scope.businesses[index].subscriberName = $scope.subscriber.selected.subscriberName;
                        $scope.businesses[index].businessName = $scope.business.businessName;
                        $scope.businesses[index].contactNo = $scope.business.contactNo;
                        $scope.businesses[index].alternateNo = $scope.business.alternateNo;
                        $scope.businesses[index].whatsapp = $scope.business.whatsapp;
                        $scope.businesses[index].emailId = $scope.business.emailId;
                        $scope.businesses[index].website = $scope.business.website;
                        if(response.imageUrl){
                            $scope.businesses[index].logoUrl = response.logoUrl;
                        }
                        $scope.businesses[index].businessAddressId = $scope.businessAddress.businessAddressId;
                        $scope.businesses[index].line1 = $scope.businessAddress.line1;
                        $scope.businesses[index].line2 = $scope.businessAddress.line2;
                    }
                    $('#editBusinessModal').modal('hide');
                }else{
                    $scope.message = response.message;
                    window.alert("Error in updating Business");
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
        this.uploadFileToUrl = function (file, uploadUrl, companyId, business, businessAddress) {
            //FormData, object of key/value pair for form fields and values
            var fileFormData = new FormData();
            fileFormData.append('file', file);
            fileFormData.append('companyId', companyId);
            fileFormData.append('business', angular.toJson(business, true));
            fileFormData.append('businessAddress', angular.toJson(businessAddress, true));
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

