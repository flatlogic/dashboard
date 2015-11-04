(function () {
    'use strict';

    angular.module('qorDash.widget.domain_details')
        .directive('domainDetails', domainDetailsDirective);

    function domainDetailsDirective() {
        return {
            restrict: "AE",
            scope: {
                node: '='
            },
            replace: true,
            bindToController: true,
            templateUrl: 'app/widgets/domain_details/domain_details.html',
            controller: function() {},
            controllerAs: 'vm'
        };
    }
})();
