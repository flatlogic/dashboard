(function () {
    'use strict';

    var module = angular.module('dockerui', [
        'dockerui.services',
        'dockerui.filters',
        'ui-notification'
    ]);

    module.constant('DOCKER_PORT', ''); // Docker port, leave as an empty string if no port is requred.  If you have a port, prefix it with a ':' i.e. :4243
    module.constant('UI_VERSION', 'v0.8.0');
    module.constant('DOCKER_API_VERSION', 'v1.20');
})();
