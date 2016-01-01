'use strict';
/**
 * @ngdoc function
 * @name mycarCareApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Manages authentication to any active providers.
 */
angular.module('mycarCareApp')
  .controller('LoginCtrl', function ($scope, Auth, $location, $q, Ref, $timeout) {
    $scope.userType = false;
    $scope.passwordLogin = function(email, pass) {
        $scope.err = null;
        Auth.$authWithPassword({email: email, password: pass}, {rememberMe: true})
            .then(redirect, showError);
        
    };

    $scope.createAccount = function(email, pass, confirm) {
      $scope.err = null;
      if( !pass ) {
        $scope.err = 'Please enter a password';
      }
      else if( pass !== confirm ) {
        $scope.err = 'Passwords do not match';
      }
      else {
        Auth.$createUser({email: email, password: pass})
          .then(function () {
            // authenticate so we have permission to write to Firebase
            return Auth.$authWithPassword({email: email, password: pass}, {rememberMe: true});
          })
          .then(createProfile)
          .then(redirect, showError);
      }

      function createProfile(user) {
        var ref = Ref.child('users/'+ user.uid), def = $q.defer();
        if($scope.userType === false ){
            ref.set({email: email,
                role:'owner'}, function(err) {
          $timeout(function() {
            if( err ) {
              def.reject(err);
            }
            else {
              def.resolve(ref);
            }
          });
        });
            
        } else {
            ref.set({email: email,
                role:'mechanic'}, function(err) {
          $timeout(function() {
            if( err ) {
              def.reject(err);
            }
            else {
              def.resolve(ref);
            }
          });
        });
        }
          
        
          
          return def.promise;
      }
    };

    

 //   function firstPartOfEmail(email) {
 //     return ucfirst(email.substr(0, email.indexOf('@'))||'');
 //   }

  //  function ucfirst (str) {
      // inspired by: http://kevin.vanzonneveld.net
  //    str += '';
  //    var f = str.charAt(0).toUpperCase();
  //    return f + str.substr(1);
  //  }

  

    function redirect() {
        
        Ref.onAuth(function(authData) {
        if (authData) {
            console.log('Authenticated with uid:', authData.uid);
            var roleRef = Ref.child('users/' +authData.uid+ '/role');
            roleRef.once('value', function(snapshot) {
                var data = snapshot.val();
                console.log('The Role is:', data);
                if (data==='owner'){
                    $location.path('/main');
                }else{
                    $location.path('/schedule');
                }
            });
        } else {
            console.log('Client unauthenticated.');
        }
    });
    }

    function showError(err) {
      $scope.err = err;
    }


  });
