describe('Controller: DomainNodeController', function() {

    var $scope;
    var $stateParams = {
            node: 'name',
            depth: 1
        },
        resolvedNetworkData = {name: 'name'};

    beforeEach(function(){
        module('ui.router');
        module('qorDash.config');
        module('qorDash.core');
        module('qorDash.auth');
        module('qorDash.domains');
    });

    beforeEach(function () {
        inject(function(_$rootScope_, _$controller_, _$state_)  {
            $scope = _$rootScope_.$new();
            spyOn(_$state_, 'go').and.returnValue(true);
            _$controller_('DomainNodeController as vm', {$scope: $scope, $stateParams: $stateParams, resolvedNetworkData: resolvedNetworkData});

        })
    });

    it('should populate $scope.node with findNode(resolvedNetworkData, $stateParams.node, parseInt($stateParams.depth))',function(){
        expect($scope.vm.node).toBe(resolvedNetworkData);
    });

});
