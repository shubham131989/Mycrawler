'use strict';

/* Controllers */

angular.module('app', ['ui.select'])
    // Chart controller 
    .controller('editProfileCtrl', ['$scope', '$localStorage', '$http', '$state', '$sce', '$rootScope', function($scope, $localStorage, $http, $state, $sce, $rootScope) {

        if(!$localStorage.loggedIn){
            //User is not logged in. Redirect the user to login page
            $state.go('access.login', {});
        }

        $scope.user = {};
        $scope.user.name = $localStorage.userName;
        $scope.currencies = [];
        $scope.packages = [];
        $scope.cities = [];
        $scope.states = [];
        $scope.state = {};
        $scope.city = {};
        $scope.currency = {};
        $scope.package = {};
        $scope.emailVerified = false;
        $scope.currency.selected = {};
        $scope.package.selected = {};
        $scope.city.selected = {};
        $scope.state.selected = {};

        $http({
            method : "GET",
            url : "assets/scripts/getState.php",
            headers: {'Cache-Conrol':'no-cache', 'Pragma':'no-cache'},
            cache: false
        }).then(function mySuccess(response) {
            $scope.states = response.data;
        }, function myError(response) {
            $scope.message = response.message;
        });

        $http({
            method : "GET",
            url : "assets/scripts/getCity.php",
            headers: {'Cache-Conrol':'no-cache', 'Pragma':'no-cache'},
            cache: false
        }).then(function mySuccess(response) {
            $scope.cities = response.data;
        }, function myError(response) {
            $scope.message = response.message;
        });

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

        $http({
            method : "GET",
            url : "assets/scripts/getPackages.php",
            headers: {'Cache-Conrol':'no-cache', 'Pragma':'no-cache'},
            cache: false
        }).then(function mySuccess(response) {
            $scope.packages = response.data;
        }, function myError(response) {
            $scope.message = response.message;
        });

        $http({
            method : "GET",
            url : "assets/scripts/getUserDetails.php",
            params : {userId : $localStorage.userId},
            headers: {'Cache-Conrol':'no-cache', 'Pragma':'no-cache'},
            cache: false
        }).then(function mySuccess(response) {
            
            $scope.user.name = response.data.name;
            $scope.user.email = response.data.emailId;
            $scope.user.password = response.data.password;
            $scope.user.cpassword = response.data.password;
            $scope.user.contact = parseInt(response.data.contact);
            $scope.user.storeName = response.data.storeName;
            $scope.user.pan = response.data.pan;
            $scope.user.gstin = response.data.gstin;
            $scope.user.storeContact = parseInt(response.data.storeContact);
            $scope.user.website = response.data.website;
            $scope.line1 = response.data.line1;
            $scope.line2 = response.data.line2;
            $scope.zip = response.data.zip;
            $scope.currency.selected.currencyId = parseInt(response.data.currencyId);
            $scope.currency.selected.currency = response.data.currency;
            $scope.package.selected.packageId = parseInt(response.data.packageId);
            $scope.package.selected.package = response.data.package;
            $scope.city.selected.cityId = parseInt(response.data.cityId);
            $scope.city.selected.city = response.data.city;
            $scope.state.selected.stateId = parseInt(response.data.stateId);
            $scope.state.selected.state = response.data.state;
        }, function myError(response) {
            $scope.message = response.message;
        });

        $scope.register = function (){
            var method = "POST";
            var url = "assets/scripts/editProfile.php";
            var data = {emailId: $scope.user.email, name: $scope.user.name, password: $scope.user.password, contact: $scope.user.contact, storeName: $scope.user.storeName, pan: $scope.user.pan, gstin: $scope.user.gstin, storeContact: $scope.user.storeContact, website: $scope.user.website, currencyId: $scope.currency.selected.currencyId, packageId: $scope.package.selected.packageId, cityId: $scope.city.selected.cityId, stateId: $scope.state.selected.stateId, line1: $scope.line1, line2: $scope.line2, zip: $scope.zip, userId: $localStorage.userId, storeId: $localStorage.storeId};
            
            $http({
                method: method,
                url: url,
                data: data,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function success(response){
                console.log(JSON.stringify(response));
                $localStorage.userName = $scope.user.name;
                $rootScope.userName = $scope.user.name;
                window.alert('Profile updated successfully');
            }, function error(response){
                //Error in registration
                $scope.message = response.message;
            });
            console.log("Triggered");
        }

        $scope.trustAsHtml = function(value) {
            return $sce.trustAsHtml(value);
        };

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