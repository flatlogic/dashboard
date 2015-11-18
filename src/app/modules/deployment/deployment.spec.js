describe('Controller: DeploymentController', function() {

    var $scope;
    var $rootScope,
        $location,
        WS_URL = "wss://ops-dev.blinker.com";

    beforeEach(function(){
        module('ui.router');
        module('qorDash.config');
        module('qorDash.core');
        module('qorDash.auth');
        module('qorDash.deployment');
    });


    beforeEach(function () {
        inject(function(_$rootScope_, _$controller_, $state)  {
            $scope = _$rootScope_.$new();
            spyOn($state, 'go').and.returnValue(true);
            _$controller_('DeploymentController', {$scope: $scope, $rootScope: $rootScope, $location: $location, WS_URL: WS_URL});
        })
    });

    describe('after loading', function(){
        it ('should populate $scope.wsTimelineUrl with WS_URL + "/v1/ws/run/timeline1"', function() {
            expect($scope.wsTimelineUrl).toBe(WS_URL + '/v1/ws/run/timeline1');
        });
    });


});
