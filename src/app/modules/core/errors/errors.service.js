(function () {
    'use strict';

    angular
        .module('qorDash.core')
        .factory('errorHandler', errorHandler);

    /**
     * Error service
     */
    function errorHandler(Notification, UNKNOWN_ERROR, UNKNOWN_SERVER_ERROR){
        return {
            showError: function(response){
                var error;
                if (typeof response === 'string') {
                    error = response;
                } else if (response.data) {
                    error = response.data.error ? response.data.error : UNKNOWN_SERVER_ERROR;
                } else {
                    error = UNKNOWN_ERROR;
                }
                Notification.error('Can\'t load data: ' + error);
                return error;
            }
        };
    }

})();
