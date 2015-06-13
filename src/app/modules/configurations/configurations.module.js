(function() {
  'use strict';

  var module = angular.module('qorDash.configurations', [
    'ui.router'
  ]);

  module.config(appConfig);

  appConfig.$inject = ['$stateProvider', '$qorSidebarProvider'];

  function appConfig($stateProvider, $qorSidebarProvider) {
    $stateProvider
      .state('app.configurations', {
        url: '/configurations',
        views: {
          'main@': {
            templateUrl: 'app/modules/configurations/configurations.html',
            controller: 'ConfigurationsController'
          }
        },
        authenticate: true
      });

    $qorSidebarProvider.config('configurations', {
      title: 'Config',
      nav: 30,
      content: '<span ui-sref="app.configurations" qor-sidebar-group-heading="Config" data-icon-class="fa fa-cogs"></span>'
    });
  }
})();
