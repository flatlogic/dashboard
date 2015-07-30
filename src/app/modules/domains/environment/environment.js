(function () {
    'use strict';

    domainEnvironmentController.$inject = ['$scope', '$stateParams'];
    function domainEnvironmentController($scope, $stateParams) {
        $scope.environment = {};
        $scope.environment.name = $stateParams.env;
        $scope.setNetworkData = function (networkData) {
            $scope.networkData = networkData;
        }
    }

    function autoScroll() {
        return {
            link: function (scope, element, attrs) {
                scope.$watch(
                    function () {
                        return element.children().height()
                    },
                    function (newValue, oldValue) {
                        if (newValue !== oldValue) {
                            $(element).scrollTop(element.children().height())
                        }
                    }
                );
            }
        }
    }

    angular.module('qorDash.domains')
        .controller('DomainEnvironmentController', domainEnvironmentController)
        .directive('autoScroll', autoScroll);
})();
