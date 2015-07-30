(function () {
    'use strict';

    var configurationsController = angular.createAuthorizedController('ConfigurationsController', ['$scope', '$rootScope', '$location', function ($scope, $rootScope, $location) {
        $scope.domains = [
            {"id": "api.foo.com", "name": "Api", "url": "https://server.com/domain/api.foo.com" },
            {"id": "blinker.com", "name": "Blinker", "url": "https://server.com/domain/blinker.com"}
        ];
    }]);

    angular.module('qorDash.configurations')
        .controller(configurationsController);

})();
