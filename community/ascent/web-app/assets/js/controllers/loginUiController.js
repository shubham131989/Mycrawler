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
                    $localStorage.catererId = response.data.catererId;
                    $localStorage.userName = response.data.userName;

                    if (response.data.isActive == 1) {
                        $localStorage.loggedIn = true;
                        $localStorage.isActive = 1;
                        $rootScope.userName = $localStorage.userName;
                        $window.location.href = '/#/app/events';
                    } else {
                        window.alert('Please make your payment to verify your account');
            		   String.format = function () {
            			  var theString = arguments[0];
            			  for (var i = 1; i < arguments.length; i++) {
            				  var regEx = new RegExp("\\{" + (i - 1) + "\\}", "gm");
            				  theString = theString.replace(regEx, arguments[i]);
            			  }
            			  return theString;
            			}
            			
            			var url = 'https://menu.spicefarm.in/assets/scripts/sendPayment.php?firstname={0}&email={1}&phone={2}&productinfo=[{"name":"{3}","description":"{4}","value":"{5}","isRequired":"true"}]&surl={6}&furl={7}&amount={8}&userId=' + $localStorage.userId;
            			window.location.href = String.format(url, $localStorage.userName, $localStorage.emailId, $localStorage.contactNo, response.data.package, "", "", 'https://sellsahi.com/assets/scripts/updatePayment.php', 'https://sellsahi.com', response.data.amount);
            
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

        $scope.goToRegister = function(){
            $state.go("access.register");
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
                $scope.message = response.message;
            });
        }

        $scope.resendOtp = function(){
            sendOTP();
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