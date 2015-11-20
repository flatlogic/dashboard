describe('Controller: ServicesController', function() {

    var $scope;
    var $state,
        resolvedDomain = {
            services: [{id:1}]
        };

    beforeEach(function(){
        module('ui.router');
        module('qorDash.configurations.services');
    });

    beforeEach(function() {

        $state = {
            go: function(path) {
                return path;
            },
            current: {
                name: 'app.configurations.services'
            }
        };
    });



    beforeEach(function () {
        inject(function(_$rootScope_, _$controller_)  {
            $scope = _$rootScope_.$new();
            spyOn($state,'go').and.callThrough();
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
