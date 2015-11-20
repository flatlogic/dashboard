describe('Controller: OrchestrateHistoryController', function() {

    var $scope;
    var $stateParams,
        previousCalls = {1: 2},
        error = 'error',
        resolvedHistory = {1: 2};

    beforeEach(function(){
        module('ui.router');
        module('qorDash.config');
        module('qorDash.core');
        module('qorDash.api');
        module('qorDash.orchestrate');
    });


    beforeEach(function () {
        inject(function(_$rootScope_, _$controller_)  {
            $scope = _$rootScope_.$new();
            $stateParams = {
                id: 'id',
                inst: 'inst',
                opt: 'opt'
            };
            _$controller_('OrchestrateHistoryController', {$scope: $scope, $stateParams: $stateParams, resolvedHistory: resolvedHistory});
        })
    });

    describe('after loading', function(){
        describe('after successful loading', function(){
            it ('should populate $scope.previousCalls with response.data', function() {
                expect($scope.previousCalls).toEqual(previousCalls);
            });
        });
    });
});
