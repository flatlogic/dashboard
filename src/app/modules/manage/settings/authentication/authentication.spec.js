describe('Controller: AuthenticationSettingsController', function() {

    var $scope;
    var $controller;

    var httpBackend;

    beforeEach(module('qorDash.core'));
    beforeEach(module('qorDash.auth'));
    beforeEach(module('qorDash.loaders'));
    beforeEach(module('qorDash.manage.settings.authentication'));

    beforeEach(module('qorDash.loaders', function($provide) {
        $provide.constant("AUTH_API_URL", "https://accounts.qor.io/v1");
        $provide.constant("Notification", "1");
    }));

    beforeEach(function () {
        inject(function(_$rootScope_, _$controller_, _dataLoader_, _user_, $httpBackend)  {
            $controller = _$controller_;
            httpBackend = $httpBackend;
            $scope = _$rootScope_.$new();
            spyOn(_dataLoader_, 'init').and.returnValue({
                then: function (next) {
                    next && next()
                }
            });
            spyOn(_user_, 'hasAccessTo').and.returnValue(true);
            _$controller_('AuthenticationSettingsController', {$scope: $scope});
        })
    });

    it('$scope.number', function(){
        expect($scope.auth).not.toBeDefined();
    });

});
