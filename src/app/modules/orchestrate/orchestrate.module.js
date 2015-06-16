(function() {
  'use strict';

  var module = angular.module('qorDash.orchestrate', [
    'ui.router',
      'qorDash.widget.traffic'
  ]);

  module.config(appConfig);

  appConfig.$inject = ['$stateProvider', '$qorSidebarProvider'];

  function appConfig($stateProvider, $qorSidebarProvider) {
    $stateProvider
      .state('app.orchestrate', {
        url: '/orchestrate',
        views: {
          'main@': {
            templateUrl: 'app/modules/orchestrate/orchestrate.html',
            controller: 'OrchestrateController'
          }
        },
        authenticate: true
      });

    $qorSidebarProvider.config('orchestrate', {
      title: 'Config',
      nav: 30,
      content: '<span ui-sref="app.orchestrate" qor-sidebar-group-heading="Orchestrate" data-icon-class="fa fa-building"></span>'
    });
  }
})();
