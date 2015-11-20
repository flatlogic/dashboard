describe('Controller: ServicesController', function() {

    var $scope,
        $state,
        resolvedDomain = {
            services: [{id:1}]
        };

    beforeEach(function(){
        module('qorDash.configurations.services');
        module(function($provide) {
            $provide.service('$state', function() {
                this.go = jasmine.createSpy('go').and.callFake(function(smth) {
                    return smth;
                });
                this.current = {
                    name: 'app.configurations.services'
                }
            });
        });
    });

    beforeEach(function () {
        inject(function(_$rootScope_, _$controller_, _$state_)  {
            $state = _$state_;
            $scope = _$rootScope_.$new();
            _$controller_('ServicesController as vm', {$scope: $scope, $state: $state, resolvedDomain: resolvedDomain});

        })
    });

    describe('after loading', function(){
        it('should populate $scope.vm.srevices with resolvedDomain.services',function(){
            expect($scope.vm.services).toBe(resolvedDomain.services);
        });

        it('should redirect to app.configurations.services.service',function(){
            expect($state.go).toHaveBeenCalledWith('.state', {service: $scope.vm.services[0]});
        });
    });
});
