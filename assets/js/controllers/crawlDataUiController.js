'use strict';


angular.module('app')
	.controller('crawlDataCtrl', ['$scope','$http', '$timeout', '$localStorage', '$state', function($scope, $http, $timeout, $localStorage, $state) {

		if(!$localStorage.loggedIn || $localStorage.isActive != 1){
            //User is not logged in. Redirect the user to login page
            $state.go('access.login', {});
        }

		$scope.getData = function(){   
			var data = {City: $scope.city, Keyword : $scope.keyword, Project: $scope.crawlers.Project ,Spider: $scope.crawlers.Spider };
		    $http({
		    	method: 'POST',
				url: 'assets/scripts/crawler.php',
			    data: data ,
				headers: {
					'Content-Type': 'application/json'
				}
				
		    }).then(function(){
				$scope.city = '';
				$scope.keyword = '';
				$scope.inputForm.$setPristine();

			});
			$timeout(getResultsJustdial,15000);	
			$timeout(getResultsIndiamart,15000);
			
		}
		        						
		$scope.exportData = function () {
			var data1 = alasql('SELECT * FROM HTML("#table1",{headers:true})');
			alasql('SELECT * INTO XLSX("data.xlsx",{headers:true}) FROM ?',[data1]);
			
		  };
		$scope.selectCrawler = [
			{Spider:'just_dial' , Project: 'Justdial'}, 
			{Spider:'indiamart' , Project:'Indiamart'}
	   ];
	   
	   	  
		function getResultsJustdial() {
			$http({
			method: 'POST',
			url: 'assets/scripts/displayResultsJustdial.php',
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(function succesfulCallback(response){
			$scope.data = response.data;
		});
	}

		function getResultsIndiamart() { 
		$http({
		method: 'POST',
		url: 'assets/scripts/displayResultsIndiamart.php',
		headers: {
			'Content-Type' : 'application/json'
		}
		}).then(function succesfulCallback(response){
		$scope.test = response.data;

	    });
	}
	getResultsIndiamart();
	getResultsJustdial();
	

	}]);

	

