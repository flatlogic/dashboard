(function () {
    'use strict';

    angular.module('qorDash.manage.settings')
        .controller('SettingsController',settingsController);


    settingsController.$inject = ['$scope'];
    function settingsController ($scope) {
        $scope.hello = 'Hello!'
    }

})();
