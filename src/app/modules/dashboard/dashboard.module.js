(function() {
  'use strict';

  var module = angular.module('qorDash.dashboard', [
    'ui.router',
    'ui.layout',
    'qorDash.widget',
    'qorDash.widget.terminal',
    'qorDash.widget.timeline',
    'qorDash.widget.events'
  ]);

  module.config(appConfig);

  appConfig.$inject = ['$stateProvider'];

  function appConfig($stateProvider) {
    $stateProvider
      .state('app.dashboard', {
        url: '/dashboard',
        templateUrl: 'app/modules/dashboard/dashboard.html',
        controller: 'DashboardController',
        authenticate: true
      })
  }
})();
