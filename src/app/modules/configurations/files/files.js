(function () {
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

        $scope.codemirrorLoaded = function (editor) {
            $scope.codeMirrorInstance = editor;
        };

        $scope.showFile = function (filePath, instance, version) {
            $scope.selectedFile.file_path = filePath;
            $scope.selectedFile.version = version;
            $scope.selectedFile.instance = instance;

            $http.get(filePath)
                .success(function (data) {
                    $scope.fileData = 'Content of ' + filePath + '\n';
                    $scope.fileData += data;
                    $scope.setEditorText();
                    $scope.codeMirrorInstance.setOption('mode', 'nginx');
                });
        };

        $scope.setEditorText = function (text) {
            if (text == undefined) {
                $scope.codeMirrorInstance.getDoc().setValue($scope.fileData);
            } else {
                $scope.codeMirrorInstance.getDoc().setValue(text);
            }
        };

        $scope.deleteFile = function (filePath) {
            for (var i in $scope.files) {
                if ($scope.files[i].path == filePath) {
                    $scope.files.splice(i, 1);
                }
            }

            if (filePath == $scope.selectedFile.file_path) {
                $scope.setEditorText("");
                $scope.selectedFile.file_path = '';
            }
        };

        $scope.selectedFile = {
            "file_path": "",
            "version": "",
            "instance": ""
        };

        $scope.saveFile = function () {
            // Take $scope.selectedFile
            alert('saved');
        };

        $scope.fileData = 'Select file to view/edit';

        $scope.editorOptions = {
            lineWrapping: true,
            lineNumbers: true,
            viewportMargin: '9999',
            theme: 'monokai',
            mode: 'javascript'
        };

        $scope.files = [
            {
                "name": "NGINX",
                "path": "data/nginx.conf"
            },
            {
                "name": "Apache",
                "path": "data/apache.conf"
            }
        ];
    }


    angular.module('qorDash.configurations')
        .controller('FilesController', filesController);
})();
