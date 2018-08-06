'use strict';

/* Controllers */

angular.module('app', ['ui.select', 'gm'])
    // Chart controller 
    .controller('registerCtrl', ['$scope', '$localStorage', '$http', '$state', '$sce', '$window', '$stateParams', 'fileUploadService', function($scope, $localStorage, $http, $state, $sce, $window, $stateParams, fileUploadService) {

        if($localStorage.loggedIn){
            $state.go('app.events', {});
        }
        
        $scope.currencies = [];
        $scope.currency = {};
        $scope.emailVerified = false;

        $http({
            method : "GET",
            url : "assets/scripts/getCurrency.php",
            headers: {'Cache-Conrol':'no-cache', 'Pragma':'no-cache'},
            cache: false
        }).then(function mySuccess(response) {
            $scope.currencies = response.data;
        }, function myError(response) {
            $scope.message = response.message;
        });

        $scope.sendOtp = function(){
            var method = "POST";
            var url = "assets/scripts/verifyEmail.php";
            var data = {emailId: $scope.user.emailId};
            
            $http({
                method: method,
                url: url,
                data: data,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function success(response){
                if(response.data.flag == 1) {
                    $('#verifyModal').modal('show');
                    $scope.userOtpId = response.data.userOtpId;

                } else {
                    //Some error occured
                    window.alert(response.data.message);
                }
            }, function error(response){
                //Error in registration
                $scope.message = response.message;
            });
        }

        $scope.resendOtp = function(){
            sendOtp();
        }

        $scope.validate = function (){
            var method = "POST";
            var url = "assets/scripts/validateOtp.php";
            var data = {emailId: $scope.user.emailId, otp: $scope.otp};
            
            $http({
                method: method,
                url: url,
                data: data,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function success(response){
                if(response.data.flag == 1) {
                    $('#verifyModal').modal('hide');
                    window.alert("Email Verified");
                    $scope.emailVerified = true;
                } else {
                    //Some error occured
                    window.alert(response.data.message);
                }
            }, function error(response){
                //Error in registration
                $scope.message = response.message;
            });
        }

        $scope.partner = $stateParams['partner'];
        $scope.partnerId = 0;
        
        if ($scope.partner) {
            var method = "POST";
            var url = "https://partner.ascentsmartwaves.com/assets/scripts/checkPartner.php";
            var data = {contactNo: $scope.partner};
            
            $http({
                method: method,
                url: url,
                data: data,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function success(response){
                console.log(JSON.stringify(response));
                if(response.data.flag == 1 && response.data.roleId == 1) {
                    $scope.partnerId = response.data.partnerId;
                } else {
                    //Some error occured
                    window.alert(response.data.message);
                }
            }, function error(response){
                //Error in registration
                $scope.message = response.message;
            });
        }
        
        $scope.register = function (){
            $scope.user.password = sha512($scope.user.password);
            var method = "POST";
            var url = "assets/scripts/register.php";
            var data = {user: $scope.user, caterer: $scope.caterer, currencyId: $scope.currency.selected.currencyId, address: $scope.address, partnerId: $scope.partnerId};
            
            $http({
                method: method,
                url: url,
                data: data,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function success(response){
                $localStorage.userId = response.data.userId;
                $localStorage.catererId = response.data.catererId;
                $localStorage.credits = 0;
                $localStorage.loggedIn = true;
                $localStorage.isActive = 1;
                $localStorage.userName = $scope.user.fname + $scope.user.lname;
                $localStorage.emailId = $scope.user.emailId;
                $window.location.href = '/#/app/events';
            }, function error(response){
                //Error in registration
                $scope.message = response.message;
            });
        }

        $scope.trustAsHtml = function(value) {
            return $sce.trustAsHtml(value);
        };
        
        $scope.$on('gmPlacesAutocomplete::placeChanged', function(){
          var place = $scope.address.line1.getPlace();
          $scope.address.line1 = place.formatted_address;
          $scope.address.latitude = place.geometry.location.lat();
          $scope.address.longitude = place.geometry.location.lng();
          $scope.address.placeId = place.place_id;
          if(!$scope.caterer.catererName){
              $scope.caterer.catererName = place.name;
          }
          if(place.formatted_phone_number && !$scope.caterer.contactNo){
              $scope.caterer.contactNo = place.formatted_phone_number.replace(/\s/g,'');
          }
          if(place.website && !$scope.caterer.website){
              $scope.caterer.website = place.website;
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

    }]);
angular.module('app')
    .filter('propsFilter', function() {
        return function(items, props) {
            var out = [];

            if (angular.isArray(items)) {
                items.forEach(function(item) {
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
        this.uploadFileToUrl = function (file, uploadUrl, catererId, itemName, description, categoryId, itemId) {
            //FormData, object of key/value pair for form fields and values
            var fileFormData = new FormData();
            fileFormData.append('file', file);
            fileFormData.append('catererId', catererId);
            fileFormData.append('itemName', itemName);
            fileFormData.append('description', description);
            fileFormData.append('categoryId', categoryId);
            if(itemId != 0){
                fileFormData.append('itemId', itemId);
            }
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