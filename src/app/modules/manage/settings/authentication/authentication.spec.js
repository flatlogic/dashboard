describe('Controller: AuthenticationSettingsController', function() {

    var $scope;
    var $controller,
        httpBackend,
        authenticationService,
        deferred,
        q,
        errorHandler;

    beforeEach(module('qorDash.core'));
    beforeEach(module('qorDash.auth'));
    beforeEach(module('qorDash.loaders'));
    beforeEach(module('qorDash.manage.settings.authentication'));

    beforeEach(module('qorDash.loaders', function($provide) {
        $provide.constant("AUTH_API_URL", "https://accounts.qor.io/v1");
        $provide.constant("Notification", "1");
    }));

    beforeEach(function() {
        authenticationService = {
            response : {
                data: [
                    {
                        "domain": "blinker.com",
                        "version": 0
                    },
                    {
                        "domain": "qor.io",
                        "version": 0
                    }
                ]
            },

            getDomains: function() {
                deferred = q.defer();
                return deferred.promise;
            }
        };

        errorHandler = {
            showError: function() {
                return false;
            }
        }
    });

    beforeEach(function () {
        inject(function(_$rootScope_, _$controller_, _dataLoader_, _user_, $httpBackend, $q, $state)  {
            q = $q;
            $controller = _$controller_;
            httpBackend = $httpBackend;
            $scope = _$rootScope_.$new();
            spyOn(_dataLoader_, 'init').and.returnValue({
                then: function (next) {
                    next && next()
                }
            });
            spyOn(_user_, 'hasAccessTo').and.returnValue(true);
            spyOn($state, 'go').and.returnValue(true);
            _$controller_('AuthenticationSettingsController', {$scope: $scope, authenticationService: authenticationService, errorHandler: errorHandler});
        })
    });

    it('should call getDomains from authenticationService after calling loadDomains', function(){
        httpBackend.expectGET('data/permissions.json').respond('');

        spyOn(authenticationService, 'getDomains').and.callThrough();
        spyOn(errorHandler, 'showError').and.callThrough();

        $scope.loadDomains();
        deferred.resolve();
        $scope.$root.$digest();

        expect(authenticationService.getDomains).toHaveBeenCalled();
    });

    it('should populate with domains array the domains when loadDomains is called', function() {
        httpBackend.expectGET('data/permissions.json').respond('');
        $scope.loadDomains();

        deferred.resolve(authenticationService.response);

        $scope.$root.$digest();

        expect($scope.domains).toBe(authenticationService.response.data);
    });
});