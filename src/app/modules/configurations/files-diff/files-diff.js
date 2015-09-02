(function () {
    'use strict';

    filesEditorController.$inject = ['$scope', '$state', '$stateParams', '$http', 'API_URL', 'Notification'];
    function filesEditorController($scope, $state, $stateParams, $http, API_URL, Notification) {

        $scope.$watch('domains', function() {
            if (!$scope.domains) {
                return;
            }
            $scope.domain = $scope.domains.filter(function (domain) {
                return domain.id == $stateParams.domain;
            })[0];
        });

        $scope.$watch('service', function() {
            if (!$scope.service) {
                return;
            }

            $scope.showDiff();
        });

        $scope.left = ["I am the very model of a modern Major-General,",
            "I've information vegetable, animal, and mineral,",
            "I know the kings of England, and I quote the fights historical,",
            "From Marathon to Waterloo, in order categorical."
        ].join('\n');

        $scope.right = ["I am the very model of a cartoon individual,",
            "My animation's comical, unusual, and whimsical,",
            "I know the kings of England, and I quote the fights historical,",
            "From wicked puns and stupid jokes to anvils that drop on your head."
        ].join('\n');

        $scope.options = {
            attrs: {
                'insert': {
                    'data-attr': 'insert',
                    'class': 'insertion'
                },
                'delete': {
                    'data-attr': 'delete'
                },
                'equal': {
                    'data-attr': 'equal'
                }
            }
        };

        $scope.fileName = $stateParams.file;

        $scope.selectedFirstInstance = $stateParams.instance;
        $scope.selectedSecondInstance = $stateParams.diffToInstance;
        $scope.selectedFirstVersion = $stateParams.version;
        $scope.selectedSecondVersion = $stateParams.diffToVersion;

        $scope.syncState = function () {
            $state.go('.', {
                instance: $scope.selectedFirstInstance,
                version: $scope.selectedFirstVersion,
                diffToInstance: $scope.selectedSecondInstance,
                diffToVersion: $scope.selectedSecondVersion,
                _preventAnimation: true
            });
        };

        $scope.selectFirstInstance = function(instance) {
            $scope.selectedFirstInstance = instance;

            $scope.syncState();
            $scope.showDiff();
        };

        $scope.selectSecondInstance = function(instance) {
            $scope.selectedSecondInstance = instance;

            $scope.syncState();
            $scope.showDiff();
        };

        $scope.selectFirstVersion = function(version) {
            $scope.selectedFirstVersion = version;

            $scope.syncState();
            $scope.showDiff();
        };

        $scope.selectSecondVersion = function(version) {
            $scope.selectedSecondVersion = version;

            $scope.syncState();
            $scope.showDiff();
        };

        $scope.isFirstInstanceActive = function(instance) {
            return instance == $scope.selectedFirstInstance;
        };

        $scope.isSecondInstanceActive = function(instance) {
            return instance == $scope.selectedSecondInstance;
        };

        $scope.isFirstVersionActive = function(version) {
            return version == $scope.selectedFirstVersion;
        };

        $scope.isSecondVersionActive = function(version) {
            return version == $scope.selectedSecondVersion;
        };

        $scope.isFirstVersionLive = function(version) {
            if (!$scope.selectedFirstInstance || !$scope.instance) {
                return false;
            }
            return version == $scope.instance.live[$scope.selectedFirstInstance][$scope.fileName];
        };

        $scope.isSecondVersionLive = function(version) {
            if (!$scope.selectedSecondInstance || !$scope.instance) {
                return false;
            }
            return version == $scope.instance.live[$scope.selectedSecondInstance][$scope.fileName];
        };

        $scope.showDiff = function() {
            if (!$scope.selectedFirstInstance ||
                !$scope.selectedSecondInstance ||
                !$scope.selectedFirstVersion ||
                !$scope.selectedSecondVersion) {
                return;
            }

            $scope.loading = true;

            var domainClass = $stateParams.domain,
                service = $scope.service,
                object = $stateParams.file;


            var getFirstFileRequest = {
                method: 'GET',
                url: API_URL + '/v1/conf/' + domainClass + '/' + $scope.selectedFirstInstance + '/' + service + '/' + $scope.selectedFirstVersion + '/' + object,
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            var getSecondFileRequest = {
                method: 'GET',
                url: API_URL + '/v1/conf/' + domainClass + '/' + $scope.selectedSecondInstance + '/' + service + '/' + $scope.selectedSecondVersion + '/' + object,
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            $http(getFirstFileRequest)
                .success (function(response) {
                    $scope.firstFileData = response;

                    $http(getSecondFileRequest)
                        .then(function(response) {
                            $scope.secondFileData = response.data;

                            $scope.loading = false;
                        }, function(e) {
                            var error = e ? e.error : 'unknown server error';
                            Notification.error('Can\'t load data: ' + error);
                            $scope.loading = false;
                        });
                })
                .error (function(e) {
                    var error = e ? e.error : 'unknown server error';
                    Notification.error('Can\'t load data: ' + error);
                    $scope.loading = false;
                });
        }
    }


    angular.module('qorDash.configurations.services.state.files.files-view.diff')
        .controller('FilesEditorController', filesEditorController);
})();
