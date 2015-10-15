(function () {
    'use strict';

    angular.module('qorDash.auth')
        .service('auth', authService)
        .run(runAuth)
        .directive('userSection', userSection)
        .directive('userActions', userActions);

    function userActions() {
        return {
            link: function (scope, element) {
                element.bind("mouseleave", function () {
                    $(element).css({opacity: 0.0, visibility: "hidden"}).animate({opacity: 0}, 100);

                    $('#user-actions').parent().css({opacity: 1.0, visibility: "visible"}).animate({opacity: 1}, 100);
                });
            }
        }
    }

    function userSection() {
        return {
            link: function (scope, element, attrs) {
                element.parent().bind('mouseenter', function () {
                    $(element.parent()).css({opacity: 0.0, visibility: "hidden"}).animate({opacity: 0}, 100);
                    $('.user-actions').css({opacity: 1.0, visibility: "visible"}).animate({opacity: 1}, 100);
                });
            }
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
    function authService($window) {
        var self = this;

        // Key to store and access token in localstorage
        self.tokenKey = 'authToken';

        self.saveToken = function (token) {
            $window.localStorage[self.tokenKey] = token;
        };

        self.getToken = function () {
            return $window.localStorage[self.tokenKey];
        };

        self.removeToken = function () {
            $window.localStorage.removeItem(self.tokenKey);
        };

        /**
         * Convert token from JWT format to an object
         * @returns {object} JSON object contains token info or empty object
         */
        self.getParsedToken = function () {
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
})();
