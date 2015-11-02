(function () {
    'use strict';

    domainEnvironmentController.$inject = ['$scope', '$stateParams', 'WS_URL'];
    function domainEnvironmentController($scope, $stateParams, WS_URL) {
        $scope.environment = {};
        $scope.environment.name = $stateParams.env;

        $scope.eventsWsUrl = WS_URL + '/v1/events';
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
