'use strict';
/**
 * @ngdoc function
 * @name muck2App.controller:AccountCtrl
 * @description
 * # AccountCtrl
 * Provides rudimentary account management functions.
 */
angular.module('mycarCareApp')
  .controller('ScheduleCtrl', function ($scope, Ref, $firebaseObject) {
    
    
    var appointments = {};
    var mechanic = Ref.getAuth();
    var appointmentsRef = $firebaseObject(Ref.child('garages/'+mechanic.uid+'/appointments/'));
    appointmentsRef.$loaded().then(function() {
        angular.forEach(appointmentsRef, function(value, key) {
           appointments[key] = value;
       });
    });
    
    $scope.appointments = appointments;

  });
