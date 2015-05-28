(function() {
  'use strict';

  var dashboardController = angular.createAuthorizedController('DashboardController', ['$scope', '$rootScope', '$location', function($scope, $rootScope, $location) {

  }]);

  angular.module('qorDash.dashboard')
    .controller(dashboardController);

})();
