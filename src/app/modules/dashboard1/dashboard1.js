(function() {
    'use strict';

    var dashboard1Controller = angular.createAuthorizedController('Dashboard1Controller', ['$scope', '$rootScope', '$location', function($scope, $rootScope, $location) {

    }]);

    var wsUrlController = angular.createAuthorizedController('WsUrlController', ['$scope', '$rootScope', function($scope, $rootScope) {
        $scope.url = '';

        $scope.changeUrl = function(id) {
            if (id == 1) {
                if ($scope.url) {
                    $rootScope.$emit('timeline:newWsUrl', $scope.url);
                    $scope.url = '';
                }
            } else if (id == 2) {
                if ($scope.url) {
                    $rootScope.$emit('treeview:newWsUrl', $scope.url);
                    $rootScope.$emit('terminal:newWsUrl', $scope.url);
                    $scope.url = '';
                }
            }
        };
    }]);

    angular.module('qorDash.dashboard1')
        .controller(dashboard1Controller)
        .controller(wsUrlController);

})();
