describe('Controller: DomainEnvironmentController', function() {

    var $scope;
    var $controller,
        httpBackend,
        q,
        $stateParams,
        env = 'env',
        networkData = {},
        WS_URL = "wss://ops-dev.blinker.com";

    beforeEach(module('ui.router'));
    beforeEach(module('qorDash.config'));
    beforeEach(module('qorDash.core'));
    beforeEach(module('qorDash.auth'));
    beforeEach(module('qorDash.domains'));

    beforeEach(function () {
        inject(function(_$rootScope_, _$controller_, $httpBackend, $q, $state)  {
            q = $q;
            $controller = _$controller_;
            httpBackend = $httpBackend;
            $scope = _$rootScope_.$new();
            $stateParams = {
                env: env,
                domain: {id:1}
            };
            spyOn($state, 'go').and.returnValue(true);
            _$controller_('DomainEnvironmentController', {$scope: $scope, $stateParams: $stateParams, WS_URL: WS_URL});
        })
    });

    describe('after loading', function(){
        it ('should define $scope.environment', function() {
            expect($scope.environment).toBeDefined();
        });

        it ('should populate $scope.domain with $stateParams.domain', function() {
            expect($scope.domain).toBe($stateParams.domain);
        });

        it ('should populate $scope.environment.name with $stateParams.env', function() {
            expect($scope.environment.name).toBe($stateParams.env);
        });

        it ('should populate $scope.eventsWsUrl with WS_URL + "/v1/events"', function() {
            expect($scope.eventsWsUrl).toBe(WS_URL + '/v1/events');
        });

        beforeEach(function(){
           spyOn($scope, 'setNetworkData').and.callThrough();
           $scope.setNetworkData(networkData);
        });

        it ('should populate $scope.networkData with networkData', function() {
            expect($scope.setNetworkData).toHaveBeenCalledWith(networkData);
            expect($scope.networkData).toBe(networkData);
        });


    });
});
