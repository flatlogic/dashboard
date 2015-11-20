describe('Controller: DomainEnvironmentController', function() {

    var $scope,
        $stateParams,
        env = 'env',
        WS_URL = "wss://ops-dev.blinker.com",
        AUTH_API_URL = 'AUTH_API_URL';

    beforeEach(function(){
        module('qorDash.domains');
        module(function ($provide) {
            $provide.value("AUTH_API_URL", AUTH_API_URL);
        });
    });

    beforeEach(function () {
        inject(function(_$rootScope_, _$controller_)  {
            $scope = _$rootScope_.$new();
            $stateParams = {
                env: env,
                domain: {id:1}
            };
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

        it ('should populate vm.eventsWsUrl with WS_URL + "/v1/events"', function() {
            expect($scope.vm.eventsWsUrl).toBe(WS_URL + "/v1/events");
        });
    });
});
