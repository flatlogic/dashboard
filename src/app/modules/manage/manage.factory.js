(function () {
    'use strict';

    angular
        .module('qorDash.manage')
        .factory('currentUser', currentUser);

    function currentUser (manageLoader) {
        return manageLoader.load();
    }
})();
