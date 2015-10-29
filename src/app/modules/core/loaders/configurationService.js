(function () {

    angular.module('qorDash.loaders')
        .factory('configurationService', configurationService);

    configurationService.$inject = ['$http', 'API_URL'];
    function configurationService ($http, API_URL) {

        return {
            loadInstance : loadInstance,
            loadEnv : loadEnv,
            files: {
                createFile : createFile,
                getFileContent : getFileContent,
                getVersions : getVersions,
                getBaseFile : getBaseFile,
                createVersion : createVersion,
                saveFile : saveFile,
                cloneFile : cloneFile,
                deleteFile : deleteFile,
                makeVersionLive : makeVersionLive
            }
        };

        function loadInstance(domain) {
            var instanceRequest = {
                method: 'GET',
                url: API_URL + '/v1/conf/' + domain + '/',
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            return $http(instanceRequest);
        }

        function loadEnv(domain) {
            return $http.get(API_URL + '/v1/env/' + domain + '/');
        }

        function createFile(domain, service, fileName, text) {
            var request = {
                method: 'POST',
                url: API_URL + '/v1/conf/' + domain + '/' + service + '/' + fileName,
                headers: {
                    'Content-Type': 'text/plain'
                },
                data: text
            };

            return $http(request);
        }

        function getFileContent(domain, instance, service, version, fileName) {
            var request = {
                method: 'GET',
                url: API_URL + '/v1/conf/' + domain + '/' + instance + '/' + service + '/' + version + '/' + fileName,
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            return $http(request);
        }

        function getVersions(domain, instance, service, fileName) {
            var versionsRequest = {
                method: 'GET',
                url: API_URL + '/v1/conf/' + domain + '/' + instance + '/' +
                    service + '/' + fileName + '/',
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            return $http(versionsRequest);
        }

        function getBaseFile(domain, service, fileName) {
            var request = {
                method: 'GET',
                url: API_URL + '/v1/conf/' + domain +
                    '/' + service + '/' + fileName,
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            return $http(request);
        }

        function createVersion(domain, instance, service, newVersionName, fileName, fileVersion) {
            var request = {
                method: 'POST',
                url: API_URL + '/v1/conf/' + domain + '/'
                    + instance + '/' + service + '/' + newVersionName + '/' + fileName,
                headers: {
                    'X-Dash-Version': fileVersion
                }
            };
            return $http(request);
        }

        function saveFile(domain, instance, service, version, fileName, fileVersion, data) {
            var request = {
                method: 'PUT',
                url: API_URL + '/v1/conf/' + domain + '/' + instance + '/' + service + '/'
                    + version + '/' + fileName,
                headers: {
                    'X-Dash-Version': fileVersion
                },
                data: data
            };
            return $http(request);
        }

        function cloneFile(domain, instance, service, version, object, data) {
            var request = {
                method: 'POST',
                url: API_URL + '/v1/conf/' + domain + '/'
                    + instance + '/' + service + '/'
                    + version + '/' + object,
                headers: {
                    'Content-Type': 'text/plain'
                },
                data: data
            };
            return $http(request);
        }

        function deleteFile(domain, instance, service, version, fileName, fileVersion) {
            var request = {
                method: 'DELETE',
                url: API_URL + '/v1/conf/' + domain + '/'
                    + instance + '/' + service + '/'
                    + version + '/' + fileName,
                headers: {
                    'X-Dash-Version': fileVersion
                }
            };
            return $http(request);
        }

        function makeVersionLive(domain, instance, service, version, fileName) {
            var postRequest = {
                method: 'POST',
                url: API_URL + '/v1/conf/' + domain + '/' + instance + '/' + service + '/' + version + '/' + fileName +  '/live',
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            return $http(postRequest);
        }
    }
})();
