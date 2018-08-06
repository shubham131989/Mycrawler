'use strict';


angular.module('app')
	.controller('archivesCtrl', ['$scope','$http', '$localStorage', '$state', function($scope, $http, $localStorage, $state) {

		if(!$localStorage.loggedIn || $localStorage.isActive != 1){
            //User is not logged in. Redirect the user to login page
            $state.go('access.login', {});
        }



		$http.get('assets/scripts/displayResultsArchivesIndiamart.php')
				.success(function(test){
					$scope.test = test;
				})
				.error(function(){
					$scope.test = "error in fetching data";
				});
		$http.get('assets/scripts/displayResultsArchivesJustdial.php')
				.success(function(data){
					$scope.data = data;
				})
				.error(function(){
					$scope.data = "error in fetching data";
				});
		$scope.selectCrawler = [
					{ name: 'Justdial'}, 
					{ name:'Indiamart'}
			   ];


		
		$scope.exportData = function () {
			var data1 = alasql('SELECT * FROM HTML("#table1",{headers:true})');
			alasql('SELECT * INTO XLSX("data.xlsx",{headers:true}) FROM ?',[data1]);
			
		  };
	

	}]);

