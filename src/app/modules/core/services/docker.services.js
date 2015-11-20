(function () {

    angular.module('qorDash.api')
        .factory('dockerService', dockerService);

    function dockerService ($http, $q, Settings, errorHandler) {

        return {
            getContainerTop: getContainerTop,
            getContainerLogs: getContainerLogs,
            containerCommit: containerCommit
        };

        function httpRequestSuccess(response) {
            return response.data;
        }

        function httpRequestFailed(response) {
            errorHandler.showError(response);
            return $q.reject(response.data ? response.data : response);
        }

        function containerCommit(id, repo) {
            // http://docs.docker.com/reference/api/docker_remote_api_<%= remoteApiVersion %>/#create-a-new-image-from-a-container-s-changes
            return $http({
                    method: 'POST',
                    url: Settings.url + '/commit',
                    params: {
                        container: id,
                        repo: repo
                    }
                })
                .then(httpRequestSuccess)
                .catch(httpRequestFailed);
        }

        function getContainerTop(id, ps_args) {
            // http://docs.docker.com/reference/api/docker_remote_api_<%= remoteApiVersion %>/#list-processes-running-inside-a-container
            return $http({
                        method: 'GET',
                        url: Settings.url + '/containers/' + id + '/top',
                        params: {
                            ps_args: ps_args
                        }
                    })
                    .then(httpRequestSuccess)
                    .catch(httpRequestFailed);
        }

        function getContainerLogs(id, params) {
            // http://docs.docker.com/reference/api/docker_remote_api_<%= remoteApiVersion %>/#get-container-logs
            return $http({
                        method: 'GET',
                        url: Settings.url + '/containers/' + id + '/logs',
                        params: {
                            stdout: params.stdout || 0,
                            stderr: params.stderr || 0,
                            timestamps: params.timestamps || 0,
                            tail: params.tail || 2000
                        }
                    })
                    .then(httpRequestSuccess)
                    .catch(httpRequestFailed);
        }
    }
})();
