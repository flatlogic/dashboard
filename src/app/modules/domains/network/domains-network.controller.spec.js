describe('Controller: DomainsNetworkController', function() {

    var $scope;
    var $controller,
        q,
        resolvedDomains=[1,2],
        response={data: 'response'},
        node={depth: 1, name: 1},
        state;

    beforeEach(function() {
        module('ui.router');
        module('qorDash.core');
        module('qorDash.domains');
        module('qorDash.api', function($provide) {
            $provide.constant("AUTH_API_URL", "https://accounts.qor.io/v1");
            $provide.constant("Notification", "");
            $provide.constant("resolvedNetworkData", "https://accounts.qor.io/v1");
        });
    });

    beforeEach(function() {
        state = {
            go: function(path) {
                return path;
            }
        };
    });


    beforeEach(function () {
        inject(function(_$rootScope_, _$controller_, $httpBackend, $q)  {
            q = $q;
            $controller = _$controller_;
            $scope = _$rootScope_.$new();
            _$controller_('DomainsNetworkController as vm', {$scope: $scope, resolvedDomains: resolvedDomains, $state: state});
        });
    });

    describe('showDetails(node)', function() {
        beforeEach(function() {
            spyOn(state, 'go').and.callThrough();
            $scope.vm.showDetails(node);
        });
        it('should call $state.go with params', function() {
           expect(state.go).toHaveBeenCalledWith('app.domains.domain.env.network.node',
               {
                   depth: node.depth,
                   node: node.name
               })
        });
    });


});
