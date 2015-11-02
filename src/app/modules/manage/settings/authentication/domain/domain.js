(function () {
    'use strict';

    angular.module('qorDash.manage.settings.authentication.domain')
        .controller('AuthenticationDomainController', authenticationDomainController);

    function authenticationDomainController($scope, authenticationService, errorHandler, currentUser, $stateParams) {
        var vm = this;

        vm.loadDomain = loadDomain;
        vm.dataChanged = dataChanged;
        vm.save = save;

        vm.itemsForSave = [];

        vm.configObject = {
            ".services": "add",
            ".services.webhooks"  : "add|edit",
            ".services.new_account_preset.scopes" : "add|edit",
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

        function dataChanged(objectName, pathToArray, data) {
            var obj = {};
            obj[pathToArray] = data;
            vm.itemsForSave.push(obj);
        }

        function save() {
            vm.itemsForSave = [];
            alert('Need to save');
        }

        function deepFind(obj, path) {
            var paths = path.split('.')
                , current = obj
                , i;

            for (i = 0; i < paths.length; ++i) {
                if (current[paths[i]] == undefined) {
                    return undefined;
                } else {
                    current = current[paths[i]];
                }
            }
            return current;
        }
    }

})();
