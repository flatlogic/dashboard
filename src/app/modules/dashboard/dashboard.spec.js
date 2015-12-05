describe('Controller: DashboardController', function() {

    var $scope,
        $rootScope,
        $location,
        API_HOST = "https://ops-dev.blinker.com";

    beforeEach(function(){
        module('qorDash.dashboard');
    });


    beforeEach(function () {
        inject(function(_$rootScope_, _$controller_)  {
            $scope = _$rootScope_.$new();
            _$controller_('DashboardController', {$scope: $scope, $rootScope: $rootScope, $location: $location, API_HOST: API_HOST});
        })
    });

    describe('after loading', function(){
        it ('defines $scope.eventsWsUrl', function() {
            expect($scope.eventsWsUrl).toBeDefined();
        });
    });


});
