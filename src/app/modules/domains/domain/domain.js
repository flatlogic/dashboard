(function () {
    'use strict';

    angular.module('qorDash.domains')
        .controller('DomainController', domainController);

    domainController.$inject = ['$scope', '$stateParams', '$http'];
    function domainController($scope, $stateParams, $http) {
        var domainId = $stateParams.id;

        $http.get('https://ops-dev.blinker.com/v1/domain/' + domainId)
            .success(function (response, status, headers) {
                $scope.domain = response;
            })
            .error(function (response, status) {
                // TODO Add error message
            });
    }
})();
