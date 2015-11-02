(function () {

    angular.module('qorDash.loaders')
        .factory('networkViewService', networkViewService);

    function networkViewService ($http) {
        return {
            load : load
        };

        function load() {
            return $http.get('data/network-data.json');
        }
    }
})();
