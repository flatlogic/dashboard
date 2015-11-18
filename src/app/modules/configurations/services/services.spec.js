describe('Controller: ServicesController', function() {

    var $scope;
    var $state,
        resolvedDomain = {
            services: [{id:1}]
        };

    beforeEach(function(){
        module('ui.router');
        module('qorDash.config');
        module('qorDash.core');
        module('qorDash.auth');
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
        inject(function(_$rootScope_, _$state_, _$controller_)  {
            $scope = _$rootScope_.$new();
            spyOn(_$state_, 'go').and.returnValue(true);
            spyOn($state,'go').and.callThrough();
            _$controller_('ServicesController', {$scope: $scope, $state: $state, resolvedDomain: resolvedDomain});

        })
    });

    describe('after loading', function(){
        var vm = {};
        vm.services = resolvedDomain.services;

        it('should redirect to app.configurations.domain',function(){
            expect($state.go).toHaveBeenCalledWith('.state', {service: vm.services[0]});
        });
    });
});
