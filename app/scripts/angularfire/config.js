angular.module('firebase.config', [])
  .constant('FBURL', 'https://mycarcaregr.firebaseio.com')
  .constant('SIMPLE_LOGIN_PROVIDERS', ['password'])

  .constant('loginRedirectPath', '/login');
