(function () {
    'use strict';



    var manageController = angular.createAuthorizedController('ManageController', ['$scope', function ($scope) {

        }]);


    currentUser.$inject = ['manageLoader'];
    function currentUser (manageLoader) {
        return manageLoader.load();
    }

    angular.module('qorDash.manage')
        .controller(manageController)
        .factory('currentUser', currentUser);
})();
