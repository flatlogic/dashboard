(function () {
    'use strict';

    angular
        .module('qorDash.dashboard')
        .controller('DashboardController', dashboardController);

    function dashboardController($scope, $rootScope, $location, API_HOST) {
        $scope.eventsWsUrl = API_HOST + '/v1/test/events';
    }
    
})();
