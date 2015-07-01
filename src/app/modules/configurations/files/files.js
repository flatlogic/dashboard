(function() {
    'use strict';

    angular.module('qorDash.configurations');

    filesController.$inject = ['$scope', '$stateParams', 'services', 'domains', '$http'];
    function filesController($scope, $stateParams, services, domains, $http) {
        $scope.domain = domains.filter(function (domain) {
            return domain.id == $stateParams.domain;
        })[0];

        $scope.service = services.filter(function (service) {
            return service.service == $stateParams.service;
        })[0];

        $http.get('data/nginx.conf')
            .success(function(data){
                $scope.fileData = data;
            });

        $scope.fileData = 'Loading...';

        $scope.codemirrorLoaded = function(editor) {
            editor.focus();
        };

        $scope.editorOptions = {
            lineWrapping : true,
            lineNumbers: true,
            viewportMargin: '9999',
            theme: 'monokai',
            mode: 'nginx'
        };

        $scope.files = [
            {
                "name": "NGINX",
                "path": "var/www/conf/nginx.conf"
            },
            {
                "name": "Apache",
                "path": "var/www/conf/apache.conf"
            }
        ];
    }


    angular.module('qorDash.configurations')
        .controller('FilesController', filesController);
})();
