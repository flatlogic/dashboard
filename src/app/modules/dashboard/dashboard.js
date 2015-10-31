(function () {
    'use strict';

    angular
        .module('qorDash.dashboard')
        .controller('DashboardController', dashboardController);

    function dashboardController($scope, $rootScope, $location, API_URL) {
        $scope.eventsWsUrl = API_URL + '/v1/test/events';
    }
    
})();
