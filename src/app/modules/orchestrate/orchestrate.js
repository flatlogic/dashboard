(function () {
    'use strict';

    angular.module('qorDash.orchestrate')
        .controller('OrchestrateController', orchestrateController);

    function orchestrateController($state, $stateParams, errorHandler, domainsLoader) {
        var vm = this;

        domainsLoader.load().then(
            function (response) {
                vm.domains = response.data;

                if(vm.domains.length === 1 && $state.current.name == 'app.orchestrate'){
                    $state.go('app.orchestrate.domain', {id: vm.domains[0].id})
                }

                vm.domain = vm.domains.filter(function (domain) {
                    return domain.id == $stateParams.id;
                })[0];
            },
            function (response) {
                vm.error = errorHandler.showError(response);
            });
    }
})();
