(function() {
    'use strict';

    var domainStatModule = angular.module('qorDash.widget.domain_stat')
        .directive('liveTile', liveTile);

    liveTile.$inject = ['$rootScope'];
    function liveTile($rootScope){
        return {
            restrict: 'C',
            link: function (scope, $el, attrs){
                $el.css('height', attrs.height).liveTile();

                // remove onResize timeouts if present
                scope.$on('$stateChangeStart', function(){
                    $el.liveTile("destroy", true);
                });
            }
        }
    };

    var domainStatController = angular.createAuthorizedController('DomainStatController', ['$scope', '$rootScope', '$timeout', function($scope, $rootScope, $timeout) {

    }]);

    domainStatModule.controller(domainStatController);
})();