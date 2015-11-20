(function () {

    angular
        .module('qorDash.loaders')
        .factory('configurationService', configurationService);

    function configurationService ($http, API_HOST, errorHandler) {

        return {
            loadPackage : loadPackage,
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

        function httpRequestSuccess(response) {
            return response.data;
        }

        function httpRequestFailed(response) {
            errorHandler.showError(response);
            return $q.reject(response.data ? response.data : response);
        }

        function loadPackage(domain) {
            return $http
                .get(API_HOST + '/v1/pkg/' + domain + '/')
                .then(httpRequestSuccess)
                .catch(httpRequestFailed);
        }

        function loadInstance(domain) {
            return $http
                .get(API_HOST + '/v1/conf/' + domain + '/')
                .then(httpRequestSuccess)
                .catch(httpRequestFailed);
        }

        function loadEnv(domain) {
            return $http
                .get(API_HOST + '/v1/env/' + domain + '/')
                .then(httpRequestSuccess)
                .catch(httpRequestFailed);
        }

        function createFile(domain, service, fileName, text) {
            var request = {
                method: 'POST',
                url: API_HOST + '/v1/conf/' + domain + '/' + service + '/' + fileName,
                headers: {
                    'Content-Type': 'text/plain'
                },
                data: text
            };

            return $http(request)
                .then(httpRequestSuccess)
                .catch(httpRequestFailed);
        }

        function getFileContent(domain, instance, service, version, fileName) {
            var request = {
                method: 'GET',
                url: API_HOST + '/v1/conf/' + domain + '/' + instance + '/' + service + '/' + version + '/' + fileName,
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            return $http(request)
                .then(httpRequestSuccess)
                .catch(httpRequestFailed);
        }

        function getVersions(domain, instance, service, fileName) {
            var versionsRequest = {
                method: 'GET',
                url: API_HOST + '/v1/conf/' + domain + '/' + instance + '/' +
                    service + '/' + fileName + '/',
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            return $http(versionsRequest)
                .then(httpRequestSuccess)
                .catch(httpRequestFailed);
        }

        function getBaseFile(domain, service, fileName) {
            var request = {
                method: 'GET',
                url: API_HOST + '/v1/conf/' + domain +
                    '/' + service + '/' + fileName,
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            return $http(request)
                .then(httpRequestSuccess)
                .catch(httpRequestFailed);
        }

        function createVersion(domain, instance, service, newVersionName, fileName, fileVersion) {
            var request = {
                method: 'POST',
                url: API_HOST + '/v1/conf/' + domain + '/'
                    + instance + '/' + service + '/' + newVersionName + '/' + fileName,
                headers: {
                    'X-Dash-Version': fileVersion
                }
            };
            return $http(request)
                .then(httpRequestSuccess)
                .catch(httpRequestFailed);
        }

        function saveFile(domain, instance, service, version, fileName, fileVersion, data) {
            var request = {
                method: 'PUT',
                url: API_HOST + '/v1/conf/' + domain + '/' + instance + '/' + service + '/'
                    + version + '/' + fileName,
                headers: {
                    'X-Dash-Version': fileVersion
                },
                data: data
            };
            return $http(request)
                .then(httpRequestSuccess)
                .catch(httpRequestFailed);
        }

        function cloneFile(domain, instance, service, version, object, data) {
            var request = {
                method: 'POST',
                url: API_HOST + '/v1/conf/' + domain + '/'
                    + instance + '/' + service + '/'
                    + version + '/' + object,
                headers: {
                    'Content-Type': 'text/plain'
                },
                data: data
            };
            return $http(request)
                .then(httpRequestSuccess)
                .catch(httpRequestFailed);
        }

        function deleteFile(domain, instance, service, version, fileName, fileVersion) {
            var request = {
                method: 'DELETE',
                url: API_HOST + '/v1/conf/' + domain + '/'
                    + instance + '/' + service + '/'
                    + version + '/' + fileName,
                headers: {
                    'X-Dash-Version': fileVersion
                }
            };
            return $http(request)
                .then(httpRequestSuccess)
                .catch(httpRequestFailed);
        }

        function makeVersionLive(domain, instance, service, version, fileName) {
            var postRequest = {
                method: 'POST',
                url: API_HOST + '/v1/conf/' + domain + '/' + instance + '/' + service + '/' + version + '/' + fileName +  '/live',
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            return $http(postRequest)
                .then(httpRequestSuccess)
                .catch(httpRequestFailed);
        }
    }
})();
