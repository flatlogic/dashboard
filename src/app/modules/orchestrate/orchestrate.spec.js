describe('Controller: OrchestrateController', function() {

    var $scope;
    var $controller,
        httpBackend,
        q,
        $stateParams = {id: 1},
        $state,
        resolvedDomains = [{id: 1}],
        domain = {};

    beforeEach(module('ui.router'));
    beforeEach(module('qorDash.config'));
    beforeEach(module('qorDash.core'));
    beforeEach(module('qorDash.auth'));
    beforeEach(module('qorDash.orchestrate'));



    beforeEach(function() {

        $state = {
            go: function(path) {
                return path;
            },
            current: {
                name: 'app.orchestrate'
            }
        };
    });



    beforeEach(function () {
        inject(function(_$rootScope_, _$controller_, $httpBackend, $q, _$state_)  {
            q = $q;
            $controller = _$controller_;
            httpBackend = $httpBackend;
            $scope = _$rootScope_.$new();

            spyOn(_$state_, 'go').and.returnValue(true);
            spyOn($state,'go').and.callThrough();
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
