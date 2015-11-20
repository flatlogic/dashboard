describe('Controller: DomainController', function() {

    var $scope;
    var resolvedDomain,
        AUTH_API_URL = 'AUTH_API_URL';

    beforeEach(function(){
        module('ui.router');
        module('qorDash.domains');
        module(function ($provide) {
            $provide.value("AUTH_API_URL", AUTH_API_URL);
        })
    });

    beforeEach(function () {
        inject(function(_$rootScope_, _$controller_)  {
            $scope = _$rootScope_.$new();
            _$controller_('DomainController as vm', {$scope:$scope, resolvedDomain: resolvedDomain});

        })
    });

    it('should populate $scope.node with findNode(resolvedNetworkData, $stateParams.node, parseInt($stateParams.depth))',function(){
        expect($scope.vm.domain).toBe(resolvedDomain);
    });

});
