describe('Controller: DomainsController', function() {

    var $scope;
    var $state,
        resolvedDomains = [{id:1}];

    beforeEach(function(){
        module('ui.router');
        module('qorDash.config');
        module('qorDash.core');
        module('qorDash.auth');
        module('qorDash.domains');
    });

    beforeEach(function() {

        $state = {
            go: function(path) {
                return path;
            },
            current: {
                name: 'app.domains'
            }
        };
    });



    beforeEach(function () {
        inject(function(_$rootScope_, _$controller_, _$state_)  {
            $scope = _$rootScope_.$new();
            spyOn(_$state_, 'go').and.returnValue(true);
            spyOn($state,'go').and.callThrough();
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
