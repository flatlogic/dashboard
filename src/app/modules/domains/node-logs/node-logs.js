(function () {
    'use strict';

    logNewWindow.$inject = ['$window', '$state', '$compile'];
    function logNewWindow($window, $state, $compile) {
        return {
            link: function (scope, element, attrs) {
                $(element).bind('click', function (event) {
                    var domTerminal = $('#terminal');
                    var terminal = domTerminal.terminal();
                    var currentData = terminal.get_output();
                    var OpenWindow = $window.open("/#log-details", "mywin", 'width=100');
                    OpenWindow.height = 600;
                    OpenWindow.currentData = currentData;
                    OpenWindow.url = domTerminal.parent().attr('ws-url');
                    $state.go('^');
                });
            }
        }
    }

    angular.module('qorDash.domains')
        .directive('logNewWindow', logNewWindow);
})();
