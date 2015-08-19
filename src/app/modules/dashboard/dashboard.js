(function () {
    'use strict';

    var dashboardController = angular.createAuthorizedController('DashboardController', ['$scope', '$rootScope', '$location', 'WS_URL', function ($scope, $rootScope, $location, WS_URL) {
        $scope.eventsWsUrl = WS_URL + '/v1/events';
    }]);

    angular.module('qorDash.dashboard')
        .controller(dashboardController);
})();
