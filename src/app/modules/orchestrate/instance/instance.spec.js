describe('Controller: OrchestrateInstanceController', function() {

    var $scope;
    var $stateParams,
        resolvedInstances = {1: 2};

    beforeEach(function(){
        module('ui.router');
        module('qorDash.config');
        module('qorDash.core');
        module('qorDash.loaders');
        module('qorDash.orchestrate');
    });

    beforeEach(function () {
        inject(function(_$rootScope_, _$controller_)  {
            $scope = _$rootScope_.$new();
            $stateParams = {
                id: 'id',
                inst: 'inst'
            };
            _$controller_('OrchestrateInstanceController', {$scope: $scope, $stateParams: $stateParams, resolvedInstances: resolvedInstances});
        })
    });

    describe('after loading', function(){
        it ('should populate $scope.title with $stateParams.inst', function() {
            expect($scope.title).toBe($stateParams.inst);
        });

        it ('should populate $scope.previousCalls with response.data', function() {
            expect($scope.workflows).toBe(resolvedInstances);
        });
    });
});
