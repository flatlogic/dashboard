describe('Controller: DomainEnvironmentController', function() {

    var $scope;
    var $stateParams,
        env = 'env',
        WS_URL = "wss://ops-dev.blinker.com";

    beforeEach(function(){
        module('ui.router');
        module('qorDash.config');
        module('qorDash.core');
        module('qorDash.auth');
        module('qorDash.domains');
    });

    beforeEach(function () {
        inject(function(_$rootScope_, _$controller_, $state)  {
            $scope = _$rootScope_.$new();
            $stateParams = {
                env: env,
                domain: {id:1}
            };
            spyOn($state, 'go').and.returnValue(true);
            _$controller_('DomainEnvironmentController as vm', {$scope: $scope, $stateParams: $stateParams, WS_URL: WS_URL});
        })
    });

    describe('after loading', function(){
        it ('should define vm.environment', function() {
            expect($scope.vm.environment).toBeDefined();
        });

        it ('should populate vm.environment.name with $stateParams.env', function() {
            expect($scope.vm.environment.name).toBe($stateParams.env);
        });
    });
});
