'use strict';

/* Controllers */

angular.module('app')
    .controller('loginCtrl', ['$scope', '$localStorage', '$http', '$state', '$window', '$rootScope', function($scope, $localStorage, $http, $state, $window, $rootScope) {

        if($localStorage.loggedIn && $localStorage.isActive == 1){
            $state.go('app.crawlData', {});
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
                    $localStorage.userName = response.data.username;
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
       
    }]);
    
