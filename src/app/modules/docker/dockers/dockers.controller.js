(function () {
    'use strict';

    angular
        .module('qorDash.docker')
        .controller('DockersController', dockersController);

    function dockersController($stateParams, resolvedDockers) {
        var vm = this;
        vm.instance = $stateParams.instance;
        vm.dockers = resolvedDockers;
    }

})();
