(function () {

    angular.module('qorDash.loaders')
        .service('configurationService', configurationService);

    configurationService.$inject = ['$http', 'API_URL'];
    function configurationService ($http, API_URL) {
        return {
            loadInstance : function(domain) {
                var instanceRequest = {
                    method: 'GET',
                    url: API_URL + '/v1/conf/' + domain + '/',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };
                return $http(instanceRequest);
            },
            loadEnv : function (domain) {
                return $http.get(API_URL + '/v1/env/' + domain + '/');
            },
            files: {
                createFile : function(domain, service, fileName, text) {
                    var request = {
                        method: 'POST',
                        url: API_URL + '/v1/conf/' + domain + '/' + service + '/' + fileName,
                        headers: {
                            'Content-Type': 'text/plain'
                        },
                        data: text
                    };

                    return $http(request);
                },
                getFileContent : function(domain, instance, service, version, fileName) {
                    var request = {
                        method: 'GET',
                        url: API_URL + '/v1/conf/' + domain + '/' + instance + '/' + service + '/' + version + '/' + fileName,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    };

                    return $http(request);
                },
                getVersions : function(domain, instance, service, fileName) {
                    var versionsRequest = {
                        method: 'GET',
                        url: API_URL + '/v1/conf/' + domain + '/' + instance + '/' +
                            service + '/' + fileName + '/',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    };
                    return $http(versionsRequest);
                },
                getBaseFile : function (domain, service, fileName) {
                    var request = {
                        method: 'GET',
                        url: API_URL + '/v1/conf/' + domainClass +
                            '/' + service + '/' + object,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    };
                    return $http(request);
                },
                createVersion : function (domain, instance, service, newVersionName, fileName, fileVersion) {
                    var request = {
                        method: 'POST',
                        url: API_URL + '/v1/conf/' + domain + '/'
                            + instance + '/' + service + '/' + newVersionName + '/' + fileName,
                        headers: {
                            'X-Dash-Version': fileVersion
                        }
                    };
                    return $http(request);
                },
                saveFile : function (domain, instance, service, version, fileName, fileVersion, data) {
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
                },
                cloneFile : function (domain, instance, service, version, object, data) {
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
                },
                deleteFile : function (domain, instance, service, version, fileName, fileVersion) {
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
                },
                makeVersionLive : function (domain, instance, service, version, fileName) {
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
        }
    }
})();
