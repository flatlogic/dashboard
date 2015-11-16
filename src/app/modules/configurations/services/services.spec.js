describe('Controller: ServicesController', function() {

    var $scope;
    var $controller,
        httpBackend,
        q,
        $state,
        resolvedDomain = {
            services: [{id:1}]
        };

    beforeEach(module('ui.router'));
    beforeEach(module('qorDash.config'));
    beforeEach(module('qorDash.core'));
    beforeEach(module('qorDash.auth'));
    beforeEach(module('qorDash.configurations'));



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
        inject(function(_$rootScope_, _$controller_, $httpBackend, $q, _$state_)  {
            q = $q;
            $controller = _$controller_;
            httpBackend = $httpBackend;
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
