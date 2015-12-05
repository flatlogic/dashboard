(function () {
    'use strict';

    angular
        .module('qorDash.dashboard')
        .controller('DashboardController', dashboardController);

    function dashboardController($scope, $rootScope, $location, EVENTS_URL) {
        $scope.eventsWsUrl = EVENTS_URL;
    }

})();
