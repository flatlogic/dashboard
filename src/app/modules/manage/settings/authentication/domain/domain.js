(function () {
    'use strict';

    angular.module('qorDash.manage.settings.authentication.domain')
        .controller('AuthenticationDomainController', authenticationDomainController);

    function authenticationDomainController($scope, authenticationService, errorHandler, currentUser, $stateParams) {
        var vm = this;

        vm.loadDomain = loadDomain;
        vm.dataChanged = dataChanged;
        vm.cloneObject = cloneObject;
        vm.save = save;

        vm.itemsForSave = [];

        vm.configObject = {
            ".webhooks"  : "add|edit",
            ".new_account_preset.scopes" : "add|edit",
            ".url" : "edit",
            ".name" : "edit",
            "." : "add"
        };

        loadDomain();

        currentUser.then(function (token) {
            vm.token = token;
        });

        function loadDomain() {
            $scope.$watch('vm.token', function (token) {
                if (!token) return;

                authenticationService.getDomainInfo($stateParams.authDomain, token).then(
                    function(response) {
                        vm.domain = response.data;
                    }, function(response) {
                        errorHandler.showError(response);
                    }
                );
            });
        }

        function cloneObject(objectName) {
            var clonedObject = $.extend(true, {}, vm.domain.services[objectName]);
            clonedObject.name = clonedObject.name + '-new';
            vm.domain.services[objectName + '-new'] = clonedObject;
        }

        function dataChanged(pathToArray, data) {
            var obj = {};
            obj[pathToArray] = data;
            vm.itemsForSave.push(obj);
        }

        function save() {
            vm.itemsForSave = [];
            alert('Need to save');
        }
    }

})();
