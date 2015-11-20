describe('Controller: OrchestrateDomainController', function() {

    var $scope;
    var resolvedDomain,
        AUTH_API_URL = 'AUTH_API_URL';

    beforeEach(function(){
        module('qorDash.orchestrate');
    });

    beforeEach(function () {
        inject(function(_$rootScope_, _$controller_)  {
            $scope = _$rootScope_.$new();
            _$controller_('OrchestrateDomainController as vm', {$scope:$scope, resolvedDomain: resolvedDomain});

        })
    });

    it('should populate $scope.node with findNode(resolvedNetworkData, $stateParams.node, parseInt($stateParams.depth))',function(){
        expect($scope.vm.domain).toBe(resolvedDomain);
    });

});
