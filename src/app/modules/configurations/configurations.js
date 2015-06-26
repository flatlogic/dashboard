(function() {
    'use strict';

    var configurationsController = angular.createAuthorizedController('ConfigurationsController', ['$scope', '$rootScope', '$location', function($scope, $rootScope, $location) {
        $scope.domains = [
            {"id":"api.foo.com", "name":"Api", "url":"https://server.com/domain/api.foo.com" },
            {"id":"portal.foo.com", "name": "Portal", "url":"https://server.com/domain/portal.foo.com"}
        ];
    }]);

    angular.module('qorDash.configurations')
        .controller(configurationsController);

})();
