describe('Controller: DomainNodeController', function() {

    var $scope,
        $stateParams = {
            node: 'name',
            depth: 1
        },
        resolvedNetworkData = {name: 'name'},
        AUTH_API_URL = 'AUTH_API_URL';

    beforeEach(function(){
        module('qorDash.domains');
        module(function ($provide) {
            $provide.value("AUTH_API_URL", AUTH_API_URL);
        });
    });

    beforeEach(function () {
        inject(function(_$rootScope_, _$controller_)  {
            $scope = _$rootScope_.$new();
            _$controller_('DomainNodeController as vm', {$scope: $scope, $stateParams: $stateParams, resolvedNetworkData: resolvedNetworkData});
        });
    });

    it('should populate $scope.node with findNode(resolvedNetworkData, $stateParams.node, parseInt($stateParams.depth))',function(){
        expect($scope.vm.node).toBe(resolvedNetworkData);
    });

});
