(function () {
    'use strict';

    var domainsController = angular.createAuthorizedController('DomainsController', ['$scope', '$state', '$stateParams', '$http', 'API_URL', 'Notification',
                                                                                            function ($scope, $state, $stateParams, $http, API_URL, Notification) {

        $http.get(API_URL + '/v1/domain/')
            .success(function (response, status, headers) {
                $scope.domains = response;

                if($scope.domains.length === 1 && $state.current.name == 'app.domains'){
                    $state.go('app.domains.domain', {id:$scope.domains[0].id})
                }

            })
            .error(function (response, code) {
                var error = response ? response.error : 'unknown server error';
                Notification.error('Can\'t load data: ' + error);
                $scope.error = error;
            });
    }]);

    angular.module('qorDash.domains')
        .controller(domainsController);
})();
