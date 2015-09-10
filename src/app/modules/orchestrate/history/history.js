(function () {
    'use strict';

    angular.module('qorDash.orchestrate');

    orchestrateHistoryController.$inject = ['$scope', '$stateParams', '$http', 'API_URL', 'Notification'];
    function orchestrateHistoryController($scope, $stateParams, $http, API_URL, Notification) {

        var domain = $stateParams.id;
        var instance = $stateParams.inst;
        var option = $stateParams.opt;

        $http.get(API_URL + '/v1/orchestrate/' + domain + '/' + instance + '/' + option + '/').success(function (data) {
            $scope.previousCalls = data;
        }).error(function(e){
            var error = e ? e.error : 'unknown server error';
            Notification.error('Can\'t load data: ' + error);
            $scope.error = error;
        });

    }

    angular.module('qorDash.orchestrate')
        .controller('OrchestrateHistoryController', orchestrateHistoryController);
})();
