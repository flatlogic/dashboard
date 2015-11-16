describe('Controller: DashboardController', function() {

    var $scope;
    var $controller,
        httpBackend,
        q,
        $rootScope,
        $location,
        API_URL = "https://ops-dev.blinker.com";

    beforeEach(module('ui.router'));
    beforeEach(module('qorDash.config'));
    beforeEach(module('qorDash.core'));
    beforeEach(module('qorDash.auth'));
    beforeEach(module('qorDash.dashboard'));


    beforeEach(function () {
        inject(function(_$rootScope_, _$controller_, $httpBackend, $q, $state)  {
            q = $q;
            $controller = _$controller_;
            httpBackend = $httpBackend;
            $scope = _$rootScope_.$new();
            spyOn($state, 'go').and.returnValue(true);
            _$controller_('DashboardController', {$scope: $scope, $rootScope: $rootScope, $location: $location, API_URL: API_URL});
        })
    });

    describe('after loading', function(){
        it ('should populate $scope.eventsWsUrl with API_URL + "/v1/test/events"', function() {
            expect($scope.eventsWsUrl).toBe(API_URL + '/v1/test/events');
        });
    });


});
