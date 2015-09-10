(function () {
    'use strict';

    angular.module('qorDash.orchestrate');

    orchestrateInstanceController.$inject = ['$scope', '$stateParams', '$http', 'API_URL', 'Notification'];
    function orchestrateInstanceController($scope, $stateParams, $http, API_URL, Notification) {

        $scope.title = $stateParams.inst;
        $scope.workflows = [];

        $http.get(API_URL + '/v1/orchestrate/'+ $stateParams.id +'/'+ $stateParams.inst +'/').success(function (data) {
            $scope.workflows = data;
        }).error(function (e) {
                var error = e ? e.error : 'unknown server error';
                Notification.error('Can\'t load data: ' + error);
                $scope.error = error;
        });
    }

    angular.module('qorDash.orchestrate')
        .controller('OrchestrateInstanceController', orchestrateInstanceController);
})();
