describe('Controller: DashboardController', function() {

    var $scope;
    var $rootScope,
        $location,
        API_HOST = "https://ops-dev.blinker.com";

    beforeEach(function(){
        module('ui.router');
        module('qorDash.config');
        module('qorDash.core');
        module('qorDash.auth');
        module('qorDash.dashboard');
    });


    beforeEach(function () {
        inject(function(_$rootScope_, _$controller_, $state)  {
            $scope = _$rootScope_.$new();
            spyOn($state, 'go').and.returnValue(true);
            _$controller_('DashboardController', {$scope: $scope, $rootScope: $rootScope, $location: $location, API_HOST: API_HOST});
        })
    });

    describe('after loading', function(){
        it ('should populate $scope.eventsWsUrl with API_HOST + "/v1/test/events"', function() {
            expect($scope.eventsWsUrl).toBe(API_HOST + '/v1/test/events');
        });
    });


});
