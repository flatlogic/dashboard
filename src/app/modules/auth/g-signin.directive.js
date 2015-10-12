(function () {
    'use strict';

    angular.module('qorDash.auth')
        .directive('gSignin', gSingin);

    function gSingin() {
        var ending = /\.apps\.googleusercontent\.com$/;

        return {
            restrict: 'A',
            link: link
        };

        function link(scope, element, attrs, ctrl, linker) {
            var auth2;
            gapi.load('auth2', function(){
                auth2 = gapi.auth2.init({
                    client_id: '138766960114-ikj7ignimooj54qabses3cc857l1a8h4.apps.googleusercontent.com',
                    cookiepolicy: 'single_host_origin'
                });

                auth2.attachClickHandler(document.getElementById('google-signin'), {}, successLogin, failedLogin);
            });
        }

        function successLogin(googleUser) {

        }

        function failedLogin (error) {

        }
    }
})();