describe('Controller: ConfigurationsController', function() {

    var $scope;
    var $stateParams = {domain: 1},
        $state,
        resolvedDomains = [{id: 1}],
        domain = {};

    beforeEach(function(){
        module('ui.router');
        module('qorDash.config');
        module('qorDash.core');
        module('qorDash.auth');
        module('qorDash.configurations');
    });



    beforeEach(function() {

        $state = {
            go: function(path) {
                return path;
            },
            current: {
                name: 'app.configurations'
            }
        };
    });



    beforeEach(function () {
        inject(function(_$rootScope_, _$controller_, _$state_)  {
            $scope = _$rootScope_.$new();
            spyOn(_$state_, 'go').and.returnValue(true);
            spyOn($state,'go').and.callThrough();
            _$controller_('ConfigurationsController', {$scope: $scope, $state: $state, $stateParams: $stateParams, resolvedDomains: resolvedDomains});
        })
    });


    describe('after loading', function(){


        it ('should populate $scope.domains with response.data', function() {
            expect($scope.domains).toBe(resolvedDomains);
        });


        it ('should redirect to app.configurations.services', function() {
            expect($state.go).toHaveBeenCalledWith('.services', {domain:$scope.domains[0].id});
        });

        describe('when domain.id == stateParams.id', function(){
            it('should populate $scope.domain', function(){
                domain.id = $stateParams.domain;
                expect($scope.domain).toEqual(domain);
            });
        });

    });
});
