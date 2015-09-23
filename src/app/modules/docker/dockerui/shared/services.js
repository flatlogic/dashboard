angular.module('dockerui.services', ['ngResource'])
    .factory('Container', function ($resource, Settings) {
        'use strict';
        // Resource for interacting with the docker containers
        // http://docs.docker.com/reference/api/docker_remote_api_<%= remoteApiVersion %>/#2-1-containers
        return $resource(Settings.url + '/:domain/:instance/:dockerId/containers/:id/:action', {
            name: '@name'
        }, {
            query: {method: 'GET', params: {all: 0, action: 'json'}, isArray: true},
            get: {method: 'GET', params: {action: 'json'}},
            start: {method: 'POST', params: {domain: '@domain', instance: '@instance', id: '@id', dockerId: '@dockerId', action: 'start'}},
            stop: {method: 'POST', params: {domain: '@domain', instance: '@instance', id: '@id', dockerId: '@dockerId', t: 5, action: 'stop'}},
            restart: {method: 'POST', params: {domain: '@domain', instance: '@instance', id: '@id', dockerId: '@dockerId', t: 5, action: 'restart'}},
            kill: {method: 'POST', params: {domain: '@domain', instance: '@instance', id: '@id', dockerId: '@dockerId', action: 'kill'}},
            pause: {method: 'POST', params: {domain: '@domain', instance: '@instance', id: '@id', dockerId: '@dockerId', action: 'pause'}},
            unpause: {method: 'POST', params: {domain: '@domain', instance: '@instance', id: '@id', dockerId: '@dockerId', action: 'unpause'}},
            changes: {method: 'GET', params: {domain: '@domain', instance: '@instance', action: 'changes'}, isArray: true},
            create: {method: 'POST', params: {domain: '@domain', instance: '@instance', action: 'create'}},
            remove: {method: 'DELETE', params: {domain: '@domain', instance: '@instance', id: '@id', dockerId: '@dockerId', v: 0}},
            rename: {method: 'POST', params: {domain: '@domain', instance: '@instance', id: '@id', dockerId: '@dockerId', action: 'rename'}, isArray: false},
            stats: {method: 'GET', params: {domain: '@domain', instance: '@instance', id: '@id', dockerId: '@dockerId', stream: false, action: 'stats'}, timeout: 2000}
        });
    })
    .factory('ContainerCommit', function ($resource, $http, Settings) {
        'use strict';
        // http://docs.docker.com/reference/api/docker_remote_api_<%= remoteApiVersion %>/#create-a-new-image-from-a-container-s-changes
        return {
            commit: function (params, callback) {
                $http({
                    method: 'POST',
                    url: Settings.url + '/' + params.domain + '/' + params.instance + '/' + params.dockerId + '/commit',
                    params: {
                        'container': params.id,
                        'repo': params.repo
                    }
                }).success(callback).error(function (data, status, headers, config) {
                    console.log(error, data);
                });
            }
        };
    })
    .factory('ContainerLogs', function ($resource, $http, Settings) {
        'use strict';
        // http://docs.docker.com/reference/api/docker_remote_api_<%= remoteApiVersion %>/#get-container-logs
        return {
            get: function (id, params, callback) {
                $http({
                    method: 'GET',
                    url: Settings.url + '/' + params.domain + '/' + params.instance + '/' + params.dockerId + '/containers/' + id + '/logs',
                    params: {
                        'stdout': params.stdout || 0,
                        'stderr': params.stderr || 0,
                        'timestamps': params.timestamps || 0,
                        'tail': params.tail || 'all'
                    }
                }).success(callback).error(function (data, status, headers, config) {
                    console.log(error, data);
                });
            }
        };
    })
    .factory('ContainerTop', function ($http, Settings) {
        'use strict';
        // http://docs.docker.com/reference/api/docker_remote_api_<%= remoteApiVersion %>/#list-processes-running-inside-a-container
        return {
            get: function (id, params, callback, errorCallback) {
                $http({
                    method: 'GET',
                    url: Settings.url + '/' + params.domain + '/' + params.instance + '/' + params.dockerId + '/containers/' + id + '/top',
                    params: {
                        ps_args: params.ps_args
                    }
                }).success(callback);
            }
        };
    })
    .factory('Image', function ($resource, Settings) {
        'use strict';
        // http://docs.docker.com/reference/api/docker_remote_api_<%= remoteApiVersion %>/#2-2-images
        return $resource(Settings.url + '/:domain/:instance/:dockerId/images/:id/:action', {}, {
            query: {method: 'GET', params: {all: 0, action: 'json'}, isArray: true},
            get: {method: 'GET', params: {action: 'json'}},
            search: {method: 'GET', params: {action: 'search'}},
            history: {method: 'GET', params: {action: 'history'}, isArray: true},
            create: {
                method: 'POST', isArray: true, transformResponse: [function f(data) {
                    var str = data.replace(/\n/g, " ").replace(/\}\W*\{/g, "}, {");
                    return angular.fromJson("[" + str + "]");
                }],
                params: {action: 'create', fromImage: '@fromImage', repo: '@repo', tag: '@tag', registry: '@registry', dockerId: '@dockerId'}
            },
            insert: {method: 'POST', params: {domain: '@domain', instance: '@instance', id: '@id', dockerId: '@dockerId', action: 'insert'}},
            push: {method: 'POST', params: {domain: '@domain', instance: '@instance', id: '@id', dockerId: '@dockerId', action: 'push'}},
            tag: {method: 'POST', params: {domain: '@domain', instance: '@instance', id: '@id', dockerId: '@dockerId', action: 'tag', force: 0, repo: '@repo'}},
            remove: {method: 'DELETE', params: {domain: '@domain', instance: '@instance', id: '@id', dockerId: '@dockerId'}, isArray: true}
        });
    })
    .factory('Docker', function ($resource, Settings) {
        'use strict';
        // http://docs.docker.com/reference/api/docker_remote_api_<%= remoteApiVersion %>/#show-the-docker-version-information
        return $resource(Settings.url + '/:domain/:instance/:dockerId/version', {}, {
            get: {method: 'GET', params: {domain: '@domain', instance: '@instance', dockerId: '@dockerId'}}
        });
    })
    .factory('Auth', function ($resource, Settings) {
        'use strict';
        // http://docs.docker.com/reference/api/docker_remote_api_<%= remoteApiVersion %>/#check-auth-configuration
        return $resource(Settings.url + '/:domain/:instance/:dockerId/auth', {}, {
            get: {method: 'GET', params: {domain: '@domain', instance: '@instance'}},
            update: {method: 'POST', params: {domain: '@domain', instance: '@instance', dockerId: '@dockerId'}}
        });
    })
    .factory('System', function ($resource, Settings) {
        'use strict';
        // http://docs.docker.com/reference/api/docker_remote_api_<%= remoteApiVersion %>/#display-system-wide-information
        return $resource(Settings.url + '/:domain/:instance/:dockerId/info', {}, {
            get: {method: 'GET', params: {domain: '@domain', instance: '@instance', dockerId: '@dockerId'}}
        });
    })
    .factory('Settings', function (DOCKER_ENDPOINT, DOCKER_PORT, DOCKER_API_VERSION, UI_VERSION) {
        'use strict';
        var url = DOCKER_ENDPOINT;
        if (DOCKER_PORT) {
            url = url + DOCKER_PORT + '\\' + DOCKER_PORT;
        }
        return {
            displayAll: false,
            endpoint: DOCKER_ENDPOINT,
            version: DOCKER_API_VERSION,
            rawUrl: DOCKER_ENDPOINT + DOCKER_PORT + '/' + DOCKER_API_VERSION,
            uiVersion: UI_VERSION,
            url: url,
            firstLoad: true
        };
    })
    .factory('ViewSpinner', function () {
        'use strict';
        var spinner = new Spinner();
        var target = document.getElementById('view');

        return {
            spin: function () {
                spinner.spin(target);
            },
            stop: function () {
                spinner.stop();
            }
        };
    })
    .factory('Messages', function ($rootScope) {
        'use strict';
        return {
            send: function (title, text) {
                //Notification.error(text);
            },
            error: function (title, text) {
                //Notification.success(text);
            }
        };
    })
    .factory('Dockerfile', function (Settings) {
        'use strict';
        // http://docs.docker.com/reference/api/docker_remote_api_<%= remoteApiVersion %>/#build-image-from-a-dockerfile
        var url = Settings.rawUrl + '/build';
        return {
            build: function (file, callback) {
                var data = new FormData();
                var dockerfile = new Blob([file], {type: 'text/text'});
                data.append('Dockerfile', dockerfile);

                var request = new XMLHttpRequest();
                request.onload = callback;
                request.open('POST', url);
                request.send(data);
            }
        };
    })
    .factory('LineChart', function (Settings) {
        'use strict';
        return {
            build: function (id, data, getkey) {
                var chart = new Chart($(id).get(0).getContext("2d"));
                var map = {};

                for (var i = 0; i < data.length; i++) {
                    var c = data[i];
                    var key = getkey(c);

                    var count = map[key];
                    if (count === undefined) {
                        count = 0;
                    }
                    count += 1;
                    map[key] = count;
                }

                var labels = [];
                data = [];
                var keys = Object.keys(map);

                for (i = keys.length - 1; i > -1; i--) {
                    var k = keys[i];
                    labels.push(k);
                    data.push(map[k]);
                }
                var dataset = {
                    fillColor: "rgba(151,187,205,0.5)",
                    strokeColor: "rgba(151,187,205,1)",
                    pointColor: "rgba(151,187,205,1)",
                    pointStrokeColor: "#fff",
                    data: data
                };
                chart.Line({
                        labels: labels,
                        datasets: [dataset]
                    },
                    {
                        scaleStepWidth: 1,
                        pointDotRadius: 1,
                        scaleOverride: true,
                        scaleSteps: labels.length
                    });
            }
        };
    });
