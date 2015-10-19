(function () {
    'use strict';

    angular.module('dockerui.services', ['ngResource'])
      .factory('Container', ['$resource', 'Settings', function ContainerFactory($resource, Settings) {
          'use strict';
          // Resource for interacting with the docker containers
          // http://docs.docker.com/reference/api/docker_remote_api_<%= remoteApiVersion %>/#2-1-containers
          return $resource(Settings.endpoint + '/:domain/:instance/:dockerId/containers/:id/:action', {
              name:     '@name',
              domain:   '@domain',
              instance: '@instance',
              dockerId: '@dockerId'
          }, {
              query: {method: 'GET', params: {all: 0, action: 'json'}, isArray: true},
              get: {method: 'GET', params: {action: 'json'}},
              start: {method: 'POST', params: {id: '@id', action: 'start'}},
              stop: {method: 'POST', params: {id: '@id', t: 5, action: 'stop'}},
              restart: {method: 'POST', params: {id: '@id', t: 5, action: 'restart'}},
              kill: {method: 'POST', params: {id: '@id', action: 'kill'}},
              pause: {method: 'POST', params: {id: '@id', action: 'pause'}},
              unpause: {method: 'POST', params: {id: '@id', action: 'unpause'}},
              changes: {method: 'GET', params: {action: 'changes'}, isArray: true},
              create: {method: 'POST', params: {action: 'create'}},
              remove: {method: 'DELETE', params: {id: '@id', v: 0}},
              rename: {method: 'POST', params: {id: '@id', action: 'rename'}, isArray: false},
              stats: {method: 'GET', params: {id: '@id', stream: false, action: 'stats'}, timeout: 2000}
          });
      }])
      .factory('Image', ['$resource', 'Settings', function ImageFactory($resource, Settings) {
          'use strict';
          // http://docs.docker.com/reference/api/docker_remote_api_<%= remoteApiVersion %>/#2-2-images
          return $resource(Settings.endpoint + '/:domain/:instance/:dockerId/images/:id/:action', {
              domain:   '@domain',
              instance: '@instance',
              dockerId: '@dockerId'
          }, {
              query: {method: 'GET', params: {all: 0, action: 'json'}, isArray: true},
              get: {method: 'GET', params: {action: 'json'}},
              search: {method: 'GET', params: {action: 'search'}},
              history: {method: 'GET', params: {action: 'history'}, isArray: true},
              create: {
                  method: 'POST', isArray: true, transformResponse: [function f(data) {
                      var str = data.replace(/\n/g, " ").replace(/\}\W*\{/g, "}, {");
                      return angular.fromJson("[" + str + "]");
                  }],
                  params: {action: 'create', fromImage: '@fromImage', repo: '@repo', tag: '@tag', registry: '@registry'}
              },
              insert: {method: 'POST', params: {id: '@id', action: 'insert'}},
              push: {method: 'POST', params: {id: '@id', action: 'push'}},
              tag: {method: 'POST', params: {id: '@id', action: 'tag', force: 0, repo: '@repo'}},
              remove: {method: 'DELETE', params: {id: '@id'}, isArray: true}
          });
      }])
      .factory('Docker', ['$resource', 'Settings', function DockerFactory($resource, Settings) {
          'use strict';
          // http://docs.docker.com/reference/api/docker_remote_api_<%= remoteApiVersion %>/#show-the-docker-version-information
          return $resource(Settings.endpoint + '/:domain/:instance/:dockerId/version', {
              domain:   '@domain',
              instance: '@instance',
              dockerId: '@dockerId'
          }, {
              get: {method: 'GET'}
          });
      }])
      .factory('Auth', ['$resource', 'Settings', function AuthFactory($resource, Settings) {
          'use strict';
          // http://docs.docker.com/reference/api/docker_remote_api_<%= remoteApiVersion %>/#check-auth-configuration
          return $resource(Settings.endpoint + '/:domain/:instance/:dockerId/auth', {
              domain:   '@domain',
              instance: '@instance',
              dockerId: '@dockerId'
          }, {
              get: {method: 'GET'},
              update: {method: 'POST'}
          });
      }])
      .factory('System', ['$resource', 'Settings', function SystemFactory($resource, Settings) {
          'use strict';
          // http://docs.docker.com/reference/api/docker_remote_api_<%= remoteApiVersion %>/#display-system-wide-information
          return $resource(Settings.endpoint + '/:domain/:instance/:dockerId/info', {
              domain:   '@domain',
              instance: '@instance',
              dockerId: '@dockerId'
          }, {
              get: {method: 'GET'}
          });
      }])
      .provider('Settings', [function SettingsFactory() {
        'use strict';

        function extractParams(url) {
          var params = url ? url.substr(1).split('/') : null;
          return params ? {
            'domain': params[0],
            'instance': params[1],
            'dockerId': params[2]
          } : {};
        }

        this.displayAll = false;
        this.port = '';
        this.endpoint = '';
        this.url = this.endpoint;
        this.urlParams = {};
        this.buildUrl = function(url) {
          url = url || '';
          this.url = this.endpoint + url;
          this.urlParams = extractParams(url);
        };

        this.$get = ['$injector', '$location', function ($injector, $location) {
          return {
            rawUrl:       this.endpoint + this.port + '/' + this.version,
            endpoint:     this.endpoint,
            uiVersion:    this.uiVersion,
            version:      this.version,
            url:          this.url,
            urlParams:    this.urlParams,
            displayAll:   this.displayAll,
            buildUrl:     this.buildUrl
          };
        }];
      }])
      .factory('Messages', ['$rootScope', function MessagesFactory($rootScope) {
          'use strict';
          return {
              send: function (title, text) {

              },
              error: function (title, text) {

              }
          };
      }])
      .factory('Dockerfile', ['Settings', function DockerfileFactory(Settings) {
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
      }]);
})();
