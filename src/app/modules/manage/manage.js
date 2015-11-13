(function () {
    'use strict';

    angular
        .module('qorDash.manage')
        .controller('ManageController', manageController)
        .factory('currentUser', currentUser);

    function manageController($scope) {

    }

    function currentUser (manageLoader) {
        return manageLoader.load();
    }
})();
