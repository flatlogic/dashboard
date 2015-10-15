(function () {
    'use strict';

    angular.module('qorDash.orchestrate')
        .controller('OrchestrateDomainController', orchestrateDomainController);

    function orchestrateDomainController($stateParams, errorHandler, domainLoader) {
        var vm = this;

        domainLoader.load($stateParams.id).then(
            function (response) {
                vm.domain = response.data;
            },
            function (response) {
                vm.error = errorHandler.showError(response);
            }
        );
    }
})();
