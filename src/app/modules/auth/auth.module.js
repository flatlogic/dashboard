(function() {
  'use strict';

  var module = angular.module('qorDash.auth', [
    'qorDash.core',
    'ui.router'
  ]);

  module.config(appConfig);

  appConfig.$inject = ['$stateProvider', '$httpProvider'];

  function appConfig($stateProvider, $httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'app/modules/auth/login.html',
        controller: 'LoginController'
      });
  }
})();
