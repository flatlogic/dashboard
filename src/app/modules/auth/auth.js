(function() {
  'use strict';

  angular.module('qorDash.auth')
    .controller('LoginController', loginController)
    .service('auth', authService)
    .service('user', userService)
    .factory('authInterceptor', authInterceptor)
    .constant('API_URL', 'https://accounts.qor.io/v1')
    .run(runAuth)
      .directive('userSection', userSection)
      .directive('userActions', userActions);

    function userActions() {
        return {
            link: function(scope, element) {
                element.bind("mouseleave", function(){
                    $(element).css({opacity: 0.0, visibility: "hidden"}).animate({opacity: 0}, 100);

                    $('#user-actions').parent().css({opacity: 1.0, visibility: "visible"}).animate({opacity: 1}, 100);
                });
            }
        }
    }

    function userSection() {
        return {
            link: function(scope, element, attrs) {
                element.parent().bind('mouseenter', function() {
                    $(element.parent()).css({opacity: 0.0, visibility: "hidden"}).animate({opacity: 0}, 100);
                    $('.user-actions').css({opacity: 1.0, visibility: "visible"}).animate({opacity: 1}, 100);
                });
            }
        }
    }

  loginController.$inject = ['$scope', '$location', 'user'];
  function loginController( $scope, $location, user ) {
    if (user.isAuthed()) {
      $location.path('/app/dashboard');
      return;
    }

    $scope.userCredentials = {
      login: '',
      password: ''
    };

    $scope.startLoginAnimation = function() {
      $('#loginButton').button('loading');
    };

    $scope.stopLoginAnimation = function() {
      $('#loginButton').button('reset');
    };

    $scope.showErrorMessage = function(message) {
      alert(message);
    };

    $scope.login = function() {
      $scope.startLoginAnimation();
      user.login($scope.userCredentials.login, $scope.userCredentials.password)
        .success(function(response) {
          window.location.reload();
        })
        .error(function(e) {
          if (!e) {
            e = {'error': 'unknown'};
          }
          switch (e.error) {
            case 'error-account-not-found':
              $scope.showErrorMessage('Account fot found');
              break;
            case 'error-bad-credentials':
              $scope.showErrorMessage('Bad credentials');
              break;
            default:
              $scope.showErrorMessage('Unknown server error')
              break;
          }

          $scope.stopLoginAnimation();
        });
    }
  }

  runAuth.$inject = ['$rootScope', '$state', 'user'];
  function runAuth($rootScope, $state, user) {
    $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
      // Go to login page if user is not authorized
      if (toState.authenticate && !user.isAuthed()) {
        $state.transitionTo("login");
        event.preventDefault();
        return;
      }
      // Go to 404 if user has no access to page controller
      if (toState.authenticate && toState.controller && !user.hasAccessTo(toState.controller)) {
        $state.transitionTo('error');
        event.preventDefault();
      }
    });
  }

  /**
   * Authorization service for working with token.
   * @param $window
   */
  authService.$inject = ['$window'];
  function authService ($window) {
    var self = this;

    // Key to store and access token in localstorage
    self.tokenKey = 'authToken';

    self.saveToken = function(token) {
      $window.localStorage[self.tokenKey] = token;
    };

    self.getToken = function() {
      return $window.localStorage[self.tokenKey];
    };

    self.removeToken = function() {
      $window.localStorage.removeItem(self.tokenKey);
    };

    /**
     * Convert token from JWT format to an object
     * @returns {object} JSON object contains token info or empty object
     */
    self.getParsedToken = function() {
      var token = self.getToken();
      if (!token) {
        return false;
      }

      // Decode from base64
      var base64Url = token.split('.')[1];
      var base64 = base64Url.replace('-', '+').replace('_', '/');

      var parsedToken = JSON.parse($window.atob(base64));
      return parsedToken;
    }
  }

  /**
   * Service for working with user authentication
   * @param $http angular http service
   * @param API_URL link to REST api
   * @param auth authorization service
   */
  userService.$inject = ['$http', 'API_URL', 'auth', 'dataLoader'];
  function userService($http, API_URL, auth, dataLoader) {
    var self = this;

    self.isAuthed = function() {
      var token = auth.getParsedToken();
      if(token) {
        // Check token expiration
        return Math.round(new Date().getTime() / 1000) <= token.exp;
      } else {
        return false;
      }
    }

    // Get all user permissions in one array of strings
    self.getPermissions = function() {
      var token = auth.getParsedToken();
      if (token) {
        return token['passport/@scopes'].split(',');
      } else {
        return [];
      }
    }

    self.login = function(username, password) {
      var request = {
        method: 'POST',
        url:    API_URL + '/auth',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          username : username,
          password : password
        }
      };

      return $http(request)
        .success(function(response) {
          if (response.token) {
            auth.saveToken(response.token);
          }
          return response;
        })
        .error(function(error) {
          return error;
        });
    };

    self.hasAccessTo = function(itemName) {
      var currentUserPermissions = self.getPermissions();
      var globalPermissions = dataLoader.getGlobalPermissions();

      var neededPermission = globalPermissions[itemName];

      if (neededPermission) {
        return currentUserPermissions.indexOf(neededPermission) != -1;
      } else {
        return false;
      }
    }

    self.logout = function() {
      auth.removeToken();
    }
  }

  // Http interceptor for attaching token to headers
  authInterceptor.$inject = ['auth'];
  function authInterceptor(auth) {
    return {
      // automatically attach Authorization header
      request: function(config) {
        var token = auth.getToken();
        if(token) {
          config.headers.Authorization = 'Bearer ' + token;
        }

        config.headers.Accept = "application/json";

        return config;
      },

      response: function(res) {
        return res;
      }
    }
  }
})();
