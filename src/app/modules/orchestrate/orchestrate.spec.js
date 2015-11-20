describe('Controller: OrchestrateController', function() {

    var $scope,
        $stateParams = {id: 1},
        $state,
        resolvedDomains = [{id: 1}],
        domain = {};

    beforeEach(function(){
        module('qorDash.orchestrate');
        module(function($provide) {
            $provide.service('$state', function() {
                this.go = jasmine.createSpy('go').and.callFake(function(smth) {
                    return smth;
                });
                this.current = {
                    name: 'app.orchestrate'
                }
            });
        });
    });

    beforeEach(function () {
        inject(function(_$rootScope_, _$controller_, _$state_)  {
            $state = _$state_;
            $scope = _$rootScope_.$new();
            _$controller_('OrchestrateController', {$scope: $scope, $state: $state, $stateParams: $stateParams, resolvedDomains: resolvedDomains});
        })
    });

    describe('after loading', function(){

        it ('should populate $scope.domains with response.data', function() {
            expect($scope.domains).toBe(resolvedDomains);
        });

        it ('should redirect to app.configurations.services', function() {
            expect($state.go).toHaveBeenCalledWith('app.orchestrate.domain', {id:$scope.domains[0].id});
        });

        it('should populate $scope.domain if domain.id == stateParams.id', function(){
            domain.id = $stateParams.id;
            expect($scope.domain).toEqual(domain);
        });
    });
});
