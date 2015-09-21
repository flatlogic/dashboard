(function () {
    'use strict';

    var dashboardController = angular.createAuthorizedController('DashboardController', ['$scope', '$rootScope', '$location', 'API_URL', function ($scope, $rootScope, $location, API_URL) {
        $scope.eventsWsUrl = API_URL + '/v1/test/events';
    }]);

    angular.module('qorDash.dashboard')
        .controller(dashboardController);
})();
