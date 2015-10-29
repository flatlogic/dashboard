(function () {
    'use strict';

    angular.module('qorDash.core')
        .service('dataLoader', dataLoaderService);


    /**
     * Loading JSON scripts from server
     */
    function dataLoaderService($window, $http) {
        // Key to store permissions in localstorage
        this.permissionsJsonKey = 'permissions_json';

        return {
            loadGlobalPermissions: loadGlobalPermissions,
            getGlobalPermissions: getGlobalPermissions,
            init: init,
            permissionsJsonKey: 'permissions_json'
        };

        // Load and save json with permission map
        function loadGlobalPermissions() {
            return $http.get('data/permissions.json')
                .then(function (result) {
                    //$window.localStorage[this.permissionsJsonKey] = JSON.stringify(result.data);
                    return result.data;
                });
        }

        function getGlobalPermissions() {
            if (!$window.localStorage[this.permissionsJsonKey]) {
                throw new Error('No global permissions loaded. Ensure that dataLoader.loadGlobalPermission has been called first');
            }
            return JSON.parse($window.localStorage[this.permissionsJsonKey]);
        }

        /**
         * Download and save all scripts. Called in page controller.
         */
        function init() {
            return this.loadGlobalPermissions();
        }
    }
})();
