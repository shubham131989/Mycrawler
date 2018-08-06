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
            var data = {emailId: $scope.emailId, password: $scope.password};
            
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
                    $localStorage.userName = response.data.userName;
                    $localStorage.loggedIn = true;
                    $localStorage.isActive = 1;
                    $rootScope.userName = $localStorage.userName;
                    $window.location.href = '/#/app/crawlData';
                    
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

        

        
       
    }]);