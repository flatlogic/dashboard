(function () {
    'use strict';

    var dockerController = angular.createAuthorizedController('DockerController', ['$state', 'resolvedDomains',
        function ($state, resolvedDomains) {
            var vm = this;
            vm.domains = resolvedDomains;
            if(vm.domains.length === 1 && $state.current.name == 'app.docker.domains'){
                $state.go('.domain', {domain:vm.domains[0].id});
            }
    }]);

    angular
        .module('qorDash.docker')
        .controller(dockerController);
})();
