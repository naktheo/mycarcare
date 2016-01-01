'use strict';

/**
 * @ngdoc function
 * @name mycarCareApp.controller:MainCtrl
 * @description
 * # HeaderCtrl
 * Controller of the mycarCareApp
 */

angular.module('mycarCareApp')
  .controller('GaragesCtrl', function ($scope, $firebaseObject, Ref, $uibModal, $log) {
    
    var authData = Ref.getAuth(); 
    $scope.animationsEnabled = true;
    var garages={};
    $scope.query = {};
    $scope.queryBy = '$';
    var garageRef = $firebaseObject(Ref.child('garages/'));
    garageRef.$loaded().then(function() {
        console.log('loaded record:', garageRef.$id,
                    garageRef.$priority, garageRef.$value);
       angular.forEach(garageRef, function(value, key) {
           console.log(key, value);
           garages[key] = value;
       });
    });
    $scope.garages = garages;
    
    
    $scope.bookModal = function (garage) {
        
        if (authData) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'selectDateTime.html',
                controller: 'BookInstanceCtrl',
                resolve: {
                    modalData: function () {
                        return{
                            data:{
                                garage:garage,
                                owner:authData.uid
                            }
                        };
                    }
                }
            });
            
            modalInstance.result.then(function () {
                
                
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        } else {
            window.alert('You need to authenticate first');
        }
    };
});


