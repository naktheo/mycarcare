'use strict';

angular.module('mycarCareApp')
    
    .controller('BookInstanceCtrl', function ($scope, $uibModalInstance, modalData ,Ref , $filter, $firebaseObject) {
    $scope.isAble = false;
    $scope.messages = {};
    
// GARAGE NAME
   $scope.name = modalData.data.garage.name;
    
// LOCATION
  $scope.location = modalData.data.garage.address+', '+modalData.data.garage.city;
    
// DATE
   
    $scope.mydate = Date.now();
    $scope.minDate = Date.now();
    $scope.open = function() {
        $scope.status.opened = true;
    };
    
    $scope.status = {
        opened: false
    };
    
    // Disable weekend selection
  $scope.disabled = function(date, mode) {
    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  };
    
// TIME
   
    var time = new Date();
    time.setHours( 8 );
    time.setMinutes( 0 );
    $scope.mytime = time;
    $scope.hstep = 1;
    $scope.mstep = 30;
    $scope.min = time;
    
    var timeMax = new Date();
    timeMax.setHours( 19 );
    timeMax.setMinutes( 0 );
    $scope.max = timeMax;
    
    $scope.ismeridian = true;
    $scope.toggleMode = function() {
    $scope.ismeridian = ! $scope.ismeridian;};
    $scope.changed = function () {};

 //   
    
    
  $scope.check = function (date1, time1) {
      var nextDate = $filter('date')(date1, 'dd/MM/yyyy');
      var nextTime = $filter('date')(time1, 'h:mm a');
      var checkRef = $firebaseObject(Ref.child('garages/'+modalData.data.garage.$key+'/appointments/'));
     
      var keepgoing = true;
      checkRef.$loaded().then(function() {
          if(checkRef.$value === null){
              $scope.isAble = true;
          }
         //  console.log(checkRef.$value);
      angular.forEach(checkRef, function(value) {         
          if (keepgoing){
              if(value.date === nextDate && value.time === nextTime){
                  console.log(value.date + ' === ' + nextDate + ' && ' + value.time + ' === ' + nextTime);
                  $scope.isAble = false;
                  keepgoing = false;
              }else{
                  console.log(value.date + ' === ' + nextDate + ' && ' + value.time + ' === ' + nextTime);
                  $scope.isAble = true;
              }
          }
          
      });
          console.log($scope.isAble);
          if($scope.isAble){
              success('Mechanic is  availiable the selected date and time.Press "Complete Booking" to complete the booking process. Thanks!!');
              
              
          }else{
              error('Mechanic is not availiable the selected date and time. Please select other date or time. Thanks!!');
          }
           
      });
  };
    
    $scope.book = function(date1, time1){
      var nextDate = $filter('date')(date1, 'dd/MM/yyyy');
      var nextTime = $filter('date')(time1, 'h:mm a');
      var owner = Ref.getAuth();
        var appointRef = Ref.child('garages/'+modalData.data.garage.$key+'/appointments/');
        appointRef.push({
            clientID: owner.uid,
            date: nextDate,
            time: nextTime
        });
        var histRef = Ref.child('users/'+owner.uid+'/history/');
        histRef.push({
            garageID:modalData.data.garage.$key,
            garage: $scope.name,
            location: $scope.location,
            date: nextDate,
            time: nextTime
        });
        window.alert('Your appointment is succesful booked');
        $uibModalInstance.close();
    };
    
    function error(err) {
      alert(err, 'danger');
    }

    function success(msg) {
      alert(msg, 'success');
    }
    
    function alert(msg, type) {
      $scope.messages = {text: msg+'', type: type};
     // $timeout(function() {
     //   $scope.messages = {};
     // }, 10000);
    }

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});

