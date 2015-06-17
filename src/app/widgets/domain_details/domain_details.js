(function() {
    'use strict';

    var domainDetailsModule = angular.module('qorDash.widget.domain_details');

    var domainDetailsController = angular.createAuthorizedController('DomainDetailsController', ['$scope', '$rootScope', '$compile' , '$state', function($scope, $rootScope, $compile, $state) {

    }]);


    domainDetailsModule.controller(domainDetailsController);
})();
