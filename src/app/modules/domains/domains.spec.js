describe('Controller: DomainsController', function() {

    var $scope,
        $state,
        resolvedDomains = [{id:1}],
        AUTH_API_URL = 'AUTH_API_URL';

    beforeEach(function(){
        module('qorDash.domains');
        module(function ($provide) {
            $provide.value("AUTH_API_URL", AUTH_API_URL);
            $provide.service('$state', function() {
                this.go = jasmine.createSpy('go').and.callFake(function(smth) {
                    return smth;
                });
                this.current = {
                    name: 'app.domains'
                }
            });
        });

    });

    beforeEach(function () {
        inject(function(_$rootScope_, _$controller_, _$state_)  {
            $state = _$state_;
            $scope = _$rootScope_.$new();
            _$controller_('DomainsController', {$scope: $scope, $state: $state, resolvedDomains: resolvedDomains});

        })
    });

    describe('after loading', function(){
        var vm = {};
        vm.domains = resolvedDomains;

        it('should redirect to app.configurations.domain',function(){
            expect($state.go).toHaveBeenCalledWith('.domain', {domain:vm.domains[0].id});
        });
    });
});
