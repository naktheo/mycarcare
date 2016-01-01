'use strict';

/**
 * @ngdoc function
 * @name mycarCareApp.controller:MainCtrl
 * @description
 * # HeaderCtrl
 * Controller of the mycarCareApp
 */
angular.module('mycarCareApp')
  .controller('IndexCtrl', function ($scope, $route,Ref) {
    $scope.$route = $route;
    Ref.onAuth(function(authData) {
        if (authData) {
            var roleRef = Ref.child('users/' +authData.uid+ '/role');
            roleRef.once('value', function(snapshot) {
                var data = snapshot.val();
                if (data==='owner'){
                    $scope.ownerShow = true;
                    $route.reload();
                }else{
                    $scope.mechanicShow = true;
                   $route.reload();
                }
            });
        } else {
            console.log('Client unauthenticated.');
            $scope.ownerShow = false;
            $scope.mechanicShow = false;
            $route.reload();
        }
    });
    
  });
