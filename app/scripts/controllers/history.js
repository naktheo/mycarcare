'use strict';
/**
 * @ngdoc function
 * @name muck2App.controller:AccountCtrl
 * @description
 * # AccountCtrl
 * Provides rudimentary account management functions.
 */
angular.module('mycarCareApp')
  .controller('HistoryCtrl', function ($scope, Ref, $firebaseObject) {
    
    
    var histories = {};
    var owner = Ref.getAuth();
    var historyRef = $firebaseObject(Ref.child('users/'+owner.uid+'/history/'));
    historyRef.$loaded().then(function() {
        angular.forEach(historyRef, function(value, key) {
           histories[key] = value;
       });
    });
    
    $scope.histories = histories;

  });
