'use strict';

/* Controllers */

angular.module('app')
    .controller('loginCtrl', ['$scope', '$localStorage', '$http', '$state', '$window', '$rootScope', function($scope, $localStorage, $http, $state, $window, $rootScope) {

        if($localStorage.loggedIn && $localStorage.isActive == 1){
            $state.go('app.events', {});
        }
        
        $scope.login = function() {

            var method = "POST";
            var url = "assets/scripts/login.php";
            var data = {emailId: $scope.emailId, password: sha512($scope.password)};
            
            $http({
                method: method,
                url: url,
                data: data,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function success(response){
                if(response.data.flag == 1){
                    //Login successful
                    $('#loginModal').modal('hide');
                    $localStorage.userId = response.data.userId;
                    $localStorage.contactNo = response.data.contactNo;
                    $localStorage.emailId = $scope.emailId;
                    $localStorage.companyId = response.data.companyId;
                    $localStorage.userName = response.data.userName;

                    if (response.data.isActive == 1) {
                        $localStorage.loggedIn = true;
                        $localStorage.isActive = 1;
                        $rootScope.userName = $localStorage.userName;
                        $window.location.href = '/#/app/events';
                    }
                } else {
                    //Some error occured
                    window.alert(response.data.message);
                }
            }, function error(response){
                //Error in login
                $scope.message = response.message;
            });

        }
        $scope.forgotPassword = function(){
            $('#forgotPasswordModal').modal('show');
        }

        $scope.sendOtp = function(){
            var method = "POST";
            var url = "assets/scripts/forgotPassword.php";
            var data = {emailId: $scope.emailId};
            
            $http({
                method: method,
                url: url,
                data: data,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function success(response){
                if(response.data.flag == 1) {
                    $('#forgotPasswordModal').modal('hide');
                    $('#verifyModal').modal('show');
                    $scope.userOtpId = response.data.userOtpId;

                } else {
                    //Some error occured
                    window.alert(response.data.message);
                }
            }, function error(response){
                //Error in sending otp
                $scope.message = response.data.message;
            });
        }

        $scope.resendOtp = function(){
            sendOtp();
        }

        $scope.changePassword = function(){
            var method = "POST";
            var url = "assets/scripts/changePassword.php";
            var data = {userId: $scope.userId, password: sha512($scope.password), emailId: $scope.emailId};
            
            $http({
                method: method,
                url: url,
                data: data,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function success(response){
                window.alert(response.data.message);
                if(response.data.flag == 1) {
                    $('#changePassword').modal('hide');
                }
            }, function error(response){
                //Error in registration
                $scope.message = response.message;
            });
        }

        $scope.validate = function () {
            var method = "POST";
            var url = "assets/scripts/validateOtp.php";
            var data = {emailId: $scope.emailId, otp: $scope.otp};
            
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
                    $('#changePassword').modal('show');            
                    $scope.userId = response.data.userId;
                } else {
                    //Some error occured
                    window.alert(response.data.message);
                }
            }, function error(response){
                //Error in registration
                $scope.message = response.message;
            });
        }

    }]);