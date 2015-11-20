describe('Controller: DomainNodeController', function() {

    var $scope;
    var $stateParams = {};

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
            _$controller_('DomainNodeController', {$scope: $scope, $stateParams: $stateParams});

        })
    });

    describe('when $scope.networkData changes && is defined', function(){

        it('should populate $scope.node with findNode(networkData, $stateParams.node, parseInt($stateParams.depth))',function(){
            $stateParams.node = 'name';
            $stateParams.depth = 0;
            $scope.networkData = {name: 'name'};
            $scope.$apply();
            expect($scope.node).toBe($scope.networkData);
        });
    });
});
