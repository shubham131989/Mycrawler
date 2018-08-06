'use strict';

/* Controllers */

angular.module('app', ['ui.select', 'ui.sortable'])
    .controller('committeeMembersCtrl', ['$scope', '$http', '$localStorage', '$state', '$sce', '$compile', 'fileUploadService', function($scope, $http, $localStorage, $state, $sce, $compile, fileUploadService) {

        if(!$localStorage.loggedIn || $localStorage.isActive != 1){
            //User is not logged in. Redirect the user to login page
            $state.go('access.login', {});
        } else {
            $scope.companyId = $localStorage.companyId;
        }
        
        $scope.committeeMembers = [];
        $scope.committeeMember = {};

        $http({
            method : "GET",
            url : "assets/scripts/getCommitteeMembers.php",
            params: {companyId: $scope.companyId},
            headers: {'Cache-Control':'no-cache', 'Pragma':'no-cache'},
            cache: false
        }).then(function mySuccess(response) {
            $scope.committeeMembers = response.data;
        }, function myError(response) {
            $scope.message = response.message;
        });
        
        $scope.sortableOptions = {
          'ui-floating': false,
          'ui-preserve-size': true,
          axis: 'y'
        };
        
        $scope.updateSortSeq = function(){
            var order = [];
            for(var i = 1; i <= $scope.committeeMembers.length; i++){
                order.push({committeeMemberId: $scope.committeeMembers[i-1].committeeMemberId, sortSeq: i });
            }
            var method = "POST";
            var url = "assets/scripts/updateSortSeq.php";
            var data = {companyId: $scope.companyId, sortOrder: angular.toJson(order,true)};

            $http({
                method: method,
                url: url,
                data: data,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function mySuccess(response) {
                if(response.data.flag === 0){
                    window.alert("Error in updating Sort Sequence");
                }
            }, function myError(response) {
                window.alert("Error in updating Sort Sequence");
            });
        };
        
        $scope.deleteCommitteeMember = function(index, committeeMemberId){
            var method = "POST";
            var url = "assets/scripts/deleteCommitteeMember.php";
            var data = {companyId: $scope.companyId, committeeMemberId: committeeMemberId};

            $http({
                method: method,
                url: url,
                data: data,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function mySuccess(response) {
                $scope.committeeMembers.splice(index, 1);
            }, function myError(response) {
                window.alert("Issue in deleting committee Member");
            });
        }
        
        $scope.showCommitteeMember = function(){
            $scope.committeeMember = {};
            $('#addCommitteeMemberModal').modal('show');
        };
        
        $scope.addCommitteeMember = function(){
            
            var uploadUrl = "assets/scripts/addCommitteeMember.php", //Url of webservice/api/server
                promise = fileUploadService.uploadFileToUrl($scope.file, uploadUrl, $scope.companyId, $scope.committeeMember);
 
            promise.then(function (response) {
                //Item addition successful. Update array objects
                if(response.flag == 1){
                    $scope.committeeMember.committeeMemberId = response.data.committeeMemberId;

                    $scope.committeeMembers.push({
                        committeeMemberId: $scope.committeeMember.committeeMemberId,
                        memberName: $scope.committeeMember.memberName,
                        contactNo: $scope.committeeMember.contactNo,
                        description: $scope.committeeMember.description,
                        imageUrl: $scope.committeeMember.imageUrl,
                        emailId: $scope.committeeMember.emailId,
                        position:$scope.committeeMember.position,
                        whatsapp:$scope.committeeMember.whatsapp
                    });
                    $('#addCommitteeMemberModal').modal('hide');
                }else{
                    $scope.message = response.message;
                    window.alert("Error in adding Committee Member");
                }
            }, function () {
                $scope.serverResponse = 'An error has occurred';
            });
        };
        
        $scope.editCommitteeMember = function(index, item){
            $scope.committeeMember = {
                    committeeMemberId: item.committeeMemberId,
                    memberName: item.memberName,
                    contactNo:item.contactNo,
                    description: item.description,
                    imageUrl: item.imageUrl,
                    emailId: item.emailId,
                    position:item.position,
                    whatsapp:item.whatsapp
            };
            $('#editCommitteeMemberModal').modal('show');
        };
        
        $scope.updateCommitteeMember = function(){
            
            var uploadUrl = "assets/scripts/updateCommitteeMember.php", //Url of webservice/api/server
            promise = fileUploadService.uploadFileToUrl($scope.file, uploadUrl, $scope.companyId, $scope.committeeMember);
            promise.then(function(response) {
                if(response.flag == 1){
                    //Item updation successful. Update array objects
                    var index = $scope.committeeMembers.findIndex(x=>x.committeeMemberId == $scope.committeeMember.committeeMemberId);
                    if(index > -1){
                        $scope.committeeMembers[index] = {
    
                            committeeMemberId: $scope.committeeMember.committeeMemberId,
                            memberName: $scope.committeeMember.memberName,
                            contactNo: $scope.committeeMember.contactNo,
                            description: $scope.committeeMember.description,
                            imageUrl: $scope.committeeMember.imageUrl,
                            emailId: $scope.committeeMember.emailId,
                            position:$scope.committeeMember.position,
                            whatsapp:$scope.committeeMember.whatsapp
                        };
                    }
                    $('#editCommitteeMemberModal').modal('hide');
                }else{
                    $scope.message = response.message;
                    window.alert("Error in updating Committee Member");
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
                              scope.$eval(clickAction)
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
    });
    
angular.module('app')
    .service('fileUploadService', function ($http, $q) {
        this.uploadFileToUrl = function (file, uploadUrl, companyId, committeeMember) {
            //FormData, object of key/value pair for form fields and values
            var fileFormData = new FormData();
            fileFormData.append('file', file);
            fileFormData.append('companyId', companyId);
            fileFormData.append('committeeMember', angular.toJson(committeeMember, true));
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
        };
    });