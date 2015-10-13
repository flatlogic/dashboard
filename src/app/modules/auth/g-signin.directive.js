(function () {
    'use strict';

    angular.module('qorDash.auth')
        .directive('gSignin', gSingin);

    gSingin.$inject = ['$rootScope'];
    function gSingin($rootScope) {
        var ending = /\.apps\.googleusercontent\.com$/;

        return {
            restrict: 'A',
            link: link
        };

        function link(scope, element, attrs, ctrl, linker) {
            var auth2;
            var clientId = attrs.clientId;

            if (!clientId) {
                return;
            }

            clientId += (ending.test(clientId) ? '' : '.apps.googleusercontent.com');

            gapi.load('auth2', function(){
                auth2 = gapi.auth2.init({
                    client_id: clientId,
                    cookiepolicy: 'single_host_origin'
                });

                auth2.attachClickHandler(document.getElementById(element.attr('id')), {}, successLogin, failedLogin);
            });
        }

        function successLogin(googleUser) {
            console.log('successLogin >>>' + googleUser);
            $rootScope.$broadcast('event:google-signin-success', googleUser.wc.access_token);
        }

        function failedLogin (error) {
            console.log('failedLogin >>>' + googleUser);
            $rootScope.$broadcast('event:google-signin-failure', error);
        }
    }
})();