(function() {
  'use strict';

  var module = angular.module('qorDash.compose', [
    'ui.router'
  ]);

  module.config(appConfig);

  appConfig.$inject = ['$stateProvider', '$qorSidebarProvider'];

  function appConfig($stateProvider, $qorSidebarProvider) {
    $stateProvider
      .state('app.compose', {
        url: '/compose',
        views: {
          'main@': {
            templateUrl: 'app/modules/compose/compose.html',
            controller: 'ComposeController'
          }
        },
        authenticate: true
      })
      .state('app.compose.sub', {
        url: '/sub',
        templateUrl: 'app/modules/compose/compose-sub.html'
      });

    $qorSidebarProvider.config('compose', {
      title: 'Compose',
      nav: 20,
      content: '<span ui-sref="app.compose" qor-sidebar-group-heading="compose" data-icon-class="fa fa-envelope"></span>'
    });
  }
})();
