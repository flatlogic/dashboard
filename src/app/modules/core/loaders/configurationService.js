(function () {

    angular.module('qorDash.loaders')
        .factory('configurationService', configurationService);

    configurationService.$inject = ['$http', 'API_URL'];
    function configurationService ($http, API_URL) {

        return {
            loadInstance : loadInstance,
            loadEnv : loadEnv,
            loadPkg: pkgLoad,
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
            },
            env: {
                createVersion: envCreateVersion,
                loadVariables: envLoadVariables,
                loadVersions: envLoadVersions,
                makeVersionLive: envMakeVersionLive,
                saveToNewTarget: envSaveToNewTarget,
                save: envSave
            },
            pkg: {
                loadVariables: pkgLoadVariables,
                loadVersions: pkgLoadVersions,
                makeLive: pkgMakeLive,
                saveToNewTarget: pkgSaveToNewTarget,
                save: pkgSave
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

        function envCreateVersion(domain, instance, service, newVersionName) {
            var request = {
                method: 'POST',
                url: API_URL + '/v1/env/' + domain + '/'
                + instance + '/' + service + '/' + newVersionName
            };

            return $http(request);
        }

        function envLoadVariables(domain, instance, service, version) {
            var request = {
                method: 'GET',
                url: API_URL + '/v1/env/' + domain + '/' + instance + '/' + service + '/' + version,
                headers: {
                    'Content-Type': 'application/json'
                },
                'version': version
            };

            return $http(request);
        }

        function envLoadVersions(domain, instance, service) {
            var request = {
                method: 'GET',
                url: API_URL + '/v1/env/' + domain + '/' + instance + '/' + service + '/',
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            return $http(request);
        }

        function envMakeVersionLive(domain, instance, service, version) {
            var request = {
                method: 'POST',
                url: API_URL + '/v1/env/' + domain + '/' + instance + '/' + service + '/' + version + '/live',
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            return $http(request);
        }

        function envSaveToNewTarget(domain, targetInstance, service, newVersionName, data) {
            var request = {
                method: 'POST',
                url: API_URL + '/v1/env/' + domain + '/' + targetInstance + '/' + service + '/' + newVersionName,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };

            return $http(request);
        }

        function envSave(domainId, instance, service,version, xDashVersion, data) {
            var request = {
                method: 'PATCH',
                url: API_URL + '/v1/env/' + domainId + '/' + instance + '/' + service + '/' + version,
                headers: {
                    'Content-Type': 'application/json',
                    'X-Dash-Version': xDashVersion
                },
                data: data
            };

            return $http(request);
        }

        function pkgLoad(domain) {
            return $http.get(API_URL + '/v1/pkg/' + domain + '/');
        }


        function pkgLoadVariables(domain, instance, service, version) {
            var request = {
                method: 'GET',
                url: API_URL + '/v1/pkg/' + domain + '/' + instance + '/' + service + '/' + version
            };

            return $http(request);
        }

        function pkgLoadVersions(domain, instance, service) {
            var request = {
                method: 'GET',
                url: API_URL + '/v1/pkg/' + domain + '/' + instance + '/' + service + '/'
            };
            return $http(request);
        }

        function pkgMakeLive(domain, instance, service, version) {
            var request = {
                method: 'POST',
                url: API_URL + '/v1/pkg/' + domain + '/' + instance + '/' + service + '/' + version + '/live',
            };

            return $http(request);
        }

        function pkgSaveToNewTarget(domain, targetInstance, service, newVersionName, data) {
            var request = {
                method: 'POST',
                url: API_URL + '/v1/pkg/' + domain + '/' + targetInstance + '/' + service + '/' + newVersionName,
                data: data
            };

            return $http(request);
        }

        function pkgSave(domainId, instance, service, version, data) {
            var request = {
                method: 'PUT',
                url: API_URL + '/v1/pkg/' + domainId + '/' + instance + '/' + service + '/' + version,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };

            return $http(request);
        }
    }
})();
