(function() {
    'use strict';

    domainEnvironmentController.$inject = ['$scope', '$stateParams'];
    function domainEnvironmentController($scope, $stateParams) {
        $scope.environment = {};
        $scope.environment.name = $stateParams.env;
        $scope.setNetworkData = function(networkData) {
            $scope.networkData = networkData;
        }
    }

    autoScroll.$inject = ['$interval'];
    function autoScroll($interval) {
        return {
            link: function(scope, element, attrs) {
                $interval(function() {
                    element.scrollTop = element.children().height();
                }, 500);
            }
        }
    }

    angular.module('qorDash.domains')
        .controller('DomainEnvironmentController', domainEnvironmentController)
        .directive('autoScroll', autoScroll);
})();
