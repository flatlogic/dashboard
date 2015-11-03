(function () {
    'use strict';

    currentUser.$inject = ['manageLoader'];
    function currentUser (manageLoader) {
        return manageLoader.load();
    }

    angular.module('qorDash.manage')
        .factory('currentUser', currentUser);
})();
