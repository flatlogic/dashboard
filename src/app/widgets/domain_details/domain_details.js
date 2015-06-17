(function() {
    'use strict';

    var domainDetailsModule = angular.module('qorDash.widget.domain_details');

    var domainDetailsController = angular.createAuthorizedController('DomainDetailsController', ['$scope', '$rootScope', '$compile' , '$state', function($scope, $rootScope, $compile, $state) {
        var list = $('#details-dropdown').children().children('ul');
        var detailsText = $('#details-text');

        $scope.showLogs = function(title, url) {
            $state.go('app.domains.sub.details.logs');
        };

        $scope.details = "";

        $rootScope.$on('details:showLogs', function(event, data) {
            var logs = data.logs;

            list.text('');
            detailsText.text('');

            for (var log in logs) {
                list.append($compile('<li><a ng-click="showLogs(\''+log+'\', \''+logs[log]+'\')">' + log + '</a></li>')($scope));
            }

            $('#details-dropdown').removeAttr('hidden');
        });

        $rootScope.$on('details:showDetails', function(event, data) {
            var details = data;

            $scope.details = details.name;

            list.text('');
            $('#details-dropdown').attr('hidden', '');

            detailsText.text(details.name);
        });
    }]);


    domainDetailsModule.controller(domainDetailsController);
})();