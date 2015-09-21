(function () {
    'use strict';

    var module = angular.module('dockerui', [
        'dockerui.services',
        'dockerui.filters'
    ]);

    module.value('DOCKER_ENDPOINT', 'https://ops-dev.blinker.com/v1/dockerapi');
    module.constant('DOCKER_PORT', ''); // Docker port, leave as an empty string if no port is requred.  If you have a port, prefix it with a ':' i.e. :4243
    module.constant('UI_VERSION', 'v0.8.0');
    module.constant('DOCKER_API_VERSION', 'v1.20');
})();
